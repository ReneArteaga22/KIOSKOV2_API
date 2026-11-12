import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import InvLista from '#models/inv_lista'
import InventarioService, { type LocalidadInput } from '#services/inventario/inventario_service'
import { ESTADOS } from '#services/inventario/constantes'
import { ok, responderError } from '#services/inventario/http'
import { texto, id, ids, monto, opcion, booleano } from '#services/inventario/validacion'
import { InvError } from '#exceptions/inv_error'
import { USUARIO_ADMIN_ID } from '#services/inventario/usuario'

function leerLocalidades(v: unknown): LocalidadInput[] {
  if (!Array.isArray(v) || v.length === 0) throw new InvError('localidades debe tener al menos un elemento')
  return v.map((l: any) => ({
    localidadId: id(l?.localidadId, 'localidadId')!,
    principal: booleano(l?.principal, false),
  }))
}

@inject()
export default class AdminListasController {
  constructor(protected inventario: InventarioService) {}

  /** GET ?estado=&equipoId=&localidadId=&areaId=&q= */
  async index({ request, response }: HttpContext) {
    try {
      const f = request.qs()
      const q = InvLista.query()
        .preload('equipoActual')
        .preload('localidades', (l) => l.preload('area'))
        .orderBy('folio')
      if (f.estado) q.where('estado', opcion(f.estado, 'estado', ESTADOS))
      if (f.equipoId) q.where('equipo_actual_id', id(f.equipoId, 'equipoId')!)
      if (f.localidadId) q.whereHas('localidades', (l) => l.where('inv_localidad.id', id(f.localidadId, 'localidadId')!))
      if (f.areaId) q.whereHas('localidades', (l) => l.where('inv_localidad.area_id', id(f.areaId, 'areaId')!))
      if (f.q) q.where('folio', 'like', `%${texto(f.q, 'q', 30)}%`)
      return ok(response, 'Listas', await q)
    } catch (e) {
      return responderError(response, e)
    }
  }

  /** Detalle con historial, equipo original y tiempos. */
  async show({ params, response }: HttpContext) {
    try {
      return ok(response, 'Lista', await this.inventario.historial(Number(params.id)))
    } catch (e) {
      return responderError(response, e)
    }
  }

  /**
   * POST { folio, descripcion?, equipoId?, localidades: [{ localidadId, principal }] }
   * Si no mandas equipoId, se asigna el equipo planeado de la localidad principal.
   */
  async store({ request, response }: HttpContext) {
    try {
      const b = request.body()
      const lista = await this.inventario.crearLista(
        {
          folio: texto(b.folio, 'folio', 30)!,
          descripcion: texto(b.descripcion, 'descripcion', 150, false),
          equipoId: id(b.equipoId, 'equipoId', false),
          localidades: leerLocalidades(b.localidades),
        },
        USUARIO_ADMIN_ID
      )
      return ok(response, `Lista ${lista.folio} creada`, lista, 201)
    } catch (e) {
      return responderError(response, e)
    }
  }

  /** PUT { folio?, descripcion? } */
  async update({ params, request, response }: HttpContext) {
    try {
      const b = request.body()
      const lista = await this.inventario.actualizarLista(Number(params.id), {
        folio: b.folio !== undefined ? texto(b.folio, 'folio', 30) : undefined,
        descripcion: b.descripcion !== undefined ? texto(b.descripcion, 'descripcion', 150, false) : undefined,
      })
      return ok(response, 'Lista actualizada', lista)
    } catch (e) {
      return responderError(response, e)
    }
  }

  /** PUT { localidades: [{ localidadId, principal }] } */
  async localidades({ params, request, response }: HttpContext) {
    try {
      const lista = await this.inventario.actualizarLocalidades(Number(params.id), leerLocalidades(request.input('localidades')))
      return ok(response, 'Localidades actualizadas', lista)
    } catch (e) {
      return responderError(response, e)
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      await this.inventario.eliminarLista(Number(params.id))
      return ok(response, 'Lista eliminada')
    } catch (e) {
      return responderError(response, e)
    }
  }

  /** POST — botón "siguiente estado". */
  async avanzar({ params, request, response }: HttpContext) {
    try {
      const lista = await this.inventario.avanzar(Number(params.id), USUARIO_ADMIN_ID)
      return ok(response, `${lista.folio} → ${lista.estado}`, lista)
    } catch (e) {
      return responderError(response, e)
    }
  }

  /** POST { estado, comentario? } — comentario obligatorio si es retroceso. */
  async cambiarEstado({ params, request, response }: HttpContext) {
    try {
      const b = request.body()
      const lista = await this.inventario.cambiarEstado(
        Number(params.id),
        opcion(b.estado, 'estado', ESTADOS),
        USUARIO_ADMIN_ID,
        texto(b.comentario, 'comentario', 200, false)
      )
      return ok(response, `${lista.folio} → ${lista.estado}`, lista)
    } catch (e) {
      return responderError(response, e)
    }
  }

  /** POST { listaIds: [], estado, comentario? } */
  async estadoMasivo({ request, response }: HttpContext) {
    try {
      const b = request.body()
      const r = await this.inventario.cambiarEstadoMasivo(
        ids(b.listaIds, 'listaIds'),
        opcion(b.estado, 'estado', ESTADOS),
        USUARIO_ADMIN_ID,
        texto(b.comentario, 'comentario', 200, false)
      )
      return ok(response, `${r.exitosas.length} actualizadas, ${r.errores.length} con error`, r)
    } catch (e) {
      return responderError(response, e)
    }
  }

  /** PATCH { sobrante, faltante } — ambos en valor absoluto (ej. 500, no -500). */
  async ajuste({ params, request, response }: HttpContext) {
    try {
      const b = request.body()
      const lista = await this.inventario.registrarAjuste(
        Number(params.id),
        monto(b.sobrante ?? 0, 'sobrante'),
        monto(b.faltante ?? 0, 'faltante')
      )
      return ok(response, 'Ajuste registrado', lista)
    } catch (e) {
      return responderError(response, e)
    }
  }

  /** POST { listaIds: [], equipoId, motivo } */
  async reasignar({ request, response }: HttpContext) {
    try {
      const b = request.body()
      const r = await this.inventario.reasignar(
        ids(b.listaIds, 'listaIds'),
        id(b.equipoId, 'equipoId')!,
        texto(b.motivo, 'motivo', 200)!,
        USUARIO_ADMIN_ID
      )
      return ok(response, `${r.reasignadas.length} reasignadas, ${r.omitidas.length} omitidas`, r)
    } catch (e) {
      return responderError(response, e)
    }
  }

  /** POST { localidadId, equipoId, motivo } */
  async reasignarLocalidad({ request, response }: HttpContext) {
    try {
      const b = request.body()
      const r = await this.inventario.reasignarLocalidad(
        id(b.localidadId, 'localidadId')!,
        id(b.equipoId, 'equipoId')!,
        texto(b.motivo, 'motivo', 200)!,
        USUARIO_ADMIN_ID
      )
      return ok(response, `${r.reasignadas.length} reasignadas, ${r.omitidas.length} omitidas`, r)
    } catch (e) {
      return responderError(response, e)
    }
  }

  /** POST { origenId, destinoId, motivo, estados?: [] } */
  async reasignarEquipo({ request, response }: HttpContext) {
    try {
      const b = request.body()
      const estados = Array.isArray(b.estados) && b.estados.length ? b.estados.map((s: unknown) => opcion(s, 'estados', ESTADOS)) : null
      const r = await this.inventario.reasignarEquipo(
        id(b.origenId, 'origenId')!,
        id(b.destinoId, 'destinoId')!,
        texto(b.motivo, 'motivo', 200)!,
        USUARIO_ADMIN_ID,
        estados
      )
      return ok(response, `${r.reasignadas.length} reasignadas, ${r.omitidas.length} omitidas`, r)
    } catch (e) {
      return responderError(response, e)
    }
  }
}
