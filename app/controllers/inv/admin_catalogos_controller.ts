import type { HttpContext } from '@adonisjs/core/http'
import InvArea from '#models/inv_area'
import InvEquipo from '#models/inv_equipo'
import InvIntegrante from '#models/inv_integrante'
import InvLocalidad from '#models/inv_localidad'
import { ROLES } from '#services/inventario/constantes'
import { ok, responderError } from '#services/inventario/http'
import { texto, id, opcion, booleano } from '#services/inventario/validacion'

/**
 * Catálogos que se cargan ANTES del inventario:
 * áreas, equipos, integrantes y localidades (con su equipo planeado).
 */
export default class AdminCatalogosController {
  // ─────────── ÁREAS ───────────
  async areas({ response }: HttpContext) {
    try {
      return ok(response, 'Áreas', await InvArea.query().orderBy('codigo'))
    } catch (e) {
      return responderError(response, e)
    }
  }

  async crearArea({ request, response }: HttpContext) {
    try {
      const b = request.body()
      const area = await InvArea.create({
        codigo: texto(b.codigo, 'codigo', 20)!.toUpperCase(),
        nombre: texto(b.nombre, 'nombre', 100)!,
      })
      return ok(response, 'Área creada', area, 201)
    } catch (e) {
      return responderError(response, e)
    }
  }

  async actualizarArea({ params, request, response }: HttpContext) {
    try {
      const area = await InvArea.findOrFail(params.id)
      const b = request.body()
      if (b.codigo !== undefined) area.codigo = texto(b.codigo, 'codigo', 20)!.toUpperCase()
      if (b.nombre !== undefined) area.nombre = texto(b.nombre, 'nombre', 100)!
      await area.save()
      return ok(response, 'Área actualizada', area)
    } catch (e) {
      return responderError(response, e)
    }
  }

  async eliminarArea({ params, response }: HttpContext) {
    try {
      await (await InvArea.findOrFail(params.id)).delete()
      return ok(response, 'Área eliminada')
    } catch (e) {
      return responderError(response, e)
    }
  }

  // ─────────── EQUIPOS ───────────
  async equipos({ response }: HttpContext) {
    try {
      const equipos = await InvEquipo.query()
        .preload('integrantes', (q) => q.orderBy('rol').orderBy('nombre_completo'))
        .preload('localidadesPlaneadas', (q) => q.preload('area').orderBy('nombre'))
        .orderBy('id')
      return ok(response, 'Equipos', equipos)
    } catch (e) {
      return responderError(response, e)
    }
  }

  async crearEquipo({ request, response }: HttpContext) {
    try {
      const b = request.body()
      const equipo = await InvEquipo.create({
        nombre: texto(b.nombre, 'nombre', 50)!,
        activo: booleano(b.activo, true),
      })
      return ok(response, 'Equipo creado', equipo, 201)
    } catch (e) {
      return responderError(response, e)
    }
  }

  async actualizarEquipo({ params, request, response }: HttpContext) {
    try {
      const equipo = await InvEquipo.findOrFail(params.id)
      const b = request.body()
      if (b.nombre !== undefined) equipo.nombre = texto(b.nombre, 'nombre', 50)!
      if (b.activo !== undefined) equipo.activo = booleano(b.activo, equipo.activo)
      await equipo.save()
      return ok(response, 'Equipo actualizado', equipo)
    } catch (e) {
      return responderError(response, e)
    }
  }

  /** Falla con 409 si tiene integrantes, localidades o listas. Para "quitar" un equipo usa activo=false. */
  async eliminarEquipo({ params, response }: HttpContext) {
    try {
      await (await InvEquipo.findOrFail(params.id)).delete()
      return ok(response, 'Equipo eliminado')
    } catch (e) {
      return responderError(response, e)
    }
  }

  // ─────────── INTEGRANTES ───────────
  async crearIntegrante({ params, request, response }: HttpContext) {
    try {
      const equipo = await InvEquipo.findOrFail(params.equipoId)
      const b = request.body()
      const integrante = await InvIntegrante.create({
        equipoId: equipo.id,
        nombreCompleto: texto(b.nombreCompleto, 'nombreCompleto', 150)!,
        rol: opcion(b.rol, 'rol', ROLES),
      })
      return ok(response, 'Integrante agregado', integrante, 201)
    } catch (e) {
      return responderError(response, e)
    }
  }

  async actualizarIntegrante({ params, request, response }: HttpContext) {
    try {
      const integrante = await InvIntegrante.findOrFail(params.id)
      const b = request.body()
      if (b.nombreCompleto !== undefined) integrante.nombreCompleto = texto(b.nombreCompleto, 'nombreCompleto', 150)!
      if (b.rol !== undefined) integrante.rol = opcion(b.rol, 'rol', ROLES)
      if (b.equipoId !== undefined) integrante.equipoId = id(b.equipoId, 'equipoId')!
      await integrante.save()
      return ok(response, 'Integrante actualizado', integrante)
    } catch (e) {
      return responderError(response, e)
    }
  }

  async eliminarIntegrante({ params, response }: HttpContext) {
    try {
      await (await InvIntegrante.findOrFail(params.id)).delete()
      return ok(response, 'Integrante eliminado')
    } catch (e) {
      return responderError(response, e)
    }
  }

  // ─────────── LOCALIDADES ───────────
  async localidades({ request, response }: HttpContext) {
    try {
      const { areaId, equipoId } = request.qs()
      const q = InvLocalidad.query().preload('area').preload('equipoPlaneado').orderBy('area_id').orderBy('nombre')
      if (areaId) q.where('area_id', id(areaId, 'areaId')!)
      if (equipoId) q.where('equipo_planeado_id', id(equipoId, 'equipoId')!)
      return ok(response, 'Localidades', await q)
    } catch (e) {
      return responderError(response, e)
    }
  }

  async crearLocalidad({ request, response }: HttpContext) {
    try {
      const b = request.body()
      const localidad = await InvLocalidad.create({
        areaId: id(b.areaId, 'areaId')!,
        nombre: texto(b.nombre, 'nombre', 100)!,
        equipoPlaneadoId: id(b.equipoPlaneadoId, 'equipoPlaneadoId', false),
      })
      return ok(response, 'Localidad creada', localidad, 201)
    } catch (e) {
      return responderError(response, e)
    }
  }

  /**
   * Cambiar equipoPlaneadoId modifica el PLAN, no las listas ya creadas.
   * Para mover listas durante el inventario usa los endpoints de reasignación.
   */
  async actualizarLocalidad({ params, request, response }: HttpContext) {
    try {
      const localidad = await InvLocalidad.findOrFail(params.id)
      const b = request.body()
      if (b.areaId !== undefined) localidad.areaId = id(b.areaId, 'areaId')!
      if (b.nombre !== undefined) localidad.nombre = texto(b.nombre, 'nombre', 100)!
      if (b.equipoPlaneadoId !== undefined) localidad.equipoPlaneadoId = id(b.equipoPlaneadoId, 'equipoPlaneadoId', false)
      await localidad.save()
      return ok(response, 'Localidad actualizada', localidad)
    } catch (e) {
      return responderError(response, e)
    }
  }

  async eliminarLocalidad({ params, response }: HttpContext) {
    try {
      await (await InvLocalidad.findOrFail(params.id)).delete()
      return ok(response, 'Localidad eliminada')
    } catch (e) {
      return responderError(response, e)
    }
  }
}
