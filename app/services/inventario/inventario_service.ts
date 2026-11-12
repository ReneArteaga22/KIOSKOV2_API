import db from '@adonisjs/lucid/services/db'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'
import { InvError } from '#exceptions/inv_error'
import InvLista from '#models/inv_lista'
import InvLocalidad from '#models/inv_localidad'
import InvEquipo from '#models/inv_equipo'
import InvListaAsignacion from '#models/inv_lista_asignacion'
import InvListaTransicion from '#models/inv_lista_transicion'
import { ESTADOS, ESTADO_MIN_AJUSTE, type EstadoLista } from './constantes.js'
import { ahora, aSql, minutosEntre } from './fechas.js'

type Trx = TransactionClientContract
export type LocalidadInput = { localidadId: number; principal?: boolean }
type Omitida = { listaId: number; folio: string; razon: string }

/**
 * Reglas de negocio del inventario.
 * Toda escritura que cambia estado o equipo inserta su historial
 * en la MISMA transacción, para que nunca queden desalineados.
 */
export default class InventarioService {
  // ───────────────────────── LISTAS ─────────────────────────

  async crearLista(
    data: { folio: string; descripcion: string | null; localidades: LocalidadInput[]; equipoId: number | null },
    usuarioId: number
  ) {
    const localidades = this.normalizarLocalidades(data.localidades)

    return db.transaction(async (trx) => {
      const locs = await this.cargarLocalidades(localidades, trx)
      const principal = locs.find((l) => l.id === localidades.find((x) => x.principal)!.localidadId)!

      if (data.equipoId) await this.validarEquipoActivo(data.equipoId, trx)
      const equipoId = data.equipoId ?? principal.equipoPlaneadoId ?? null

      const t = ahora()
      const lista = await InvLista.create(
        {
          folio: data.folio.toUpperCase(),
          descripcion: data.descripcion,
          estado: 'SIN_ENTREGAR',
          estadoDesde: t,
          creadoEn: t,
          equipoActualId: equipoId,
          ajustePositivo: 0,
          ajusteNegativo: 0,
        },
        { client: trx }
      )

      await this.sincronizarLocalidades(lista, localidades)

      await InvListaTransicion.create(
        { listaId: lista.id, estadoAnterior: null, estadoNuevo: 'SIN_ENTREGAR', fecha: t, usuarioId, comentario: 'Alta de lista' },
        { client: trx }
      )

      if (equipoId) {
        await InvListaAsignacion.create(
          {
            listaId: lista.id,
            equipoId,
            inicio: t,
            fin: null,
            motivo: data.equipoId ? 'Asignación inicial' : 'Asignación inicial (equipo planeado de la localidad)',
            usuarioId,
          },
          { client: trx }
        )
      }
      return lista
    })
  }

  /** Corrige folio/descripción. No afecta estado ni equipo. */
  async actualizarLista(listaId: number, data: { folio?: string | null; descripcion?: string | null }) {
    const lista = await InvLista.findOrFail(listaId)
    if (data.folio) lista.folio = data.folio.toUpperCase()
    if (data.descripcion !== undefined) lista.descripcion = data.descripcion
    await lista.save()
    return lista
  }

  /** Cambia las localidades ligadas. No reasigna equipo (eso es explícito). */
  async actualizarLocalidades(listaId: number, localidadesInput: LocalidadInput[]) {
    const localidades = this.normalizarLocalidades(localidadesInput)
    return db.transaction(async (trx) => {
      const lista = await InvLista.query({ client: trx }).where('id', listaId).forUpdate().firstOrFail()
      await this.cargarLocalidades(localidades, trx)
      await this.sincronizarLocalidades(lista, localidades)
      return lista
    })
  }

  /** Solo se permite borrar listas que no se han entregado (corrección de captura). */
  async eliminarLista(listaId: number) {
    const lista = await InvLista.findOrFail(listaId)
    if (lista.estado !== 'SIN_ENTREGAR') {
      throw new InvError('Solo se pueden eliminar listas en SIN_ENTREGAR', 409)
    }
    await lista.delete()
  }

  // ───────────────────────── ESTADOS ─────────────────────────

  /**
   * Avanzar: solo un paso a la vez.
   * Retroceder: permitido a cualquier estado anterior, con comentario obligatorio.
   */
  async cambiarEstado(listaId: number, nuevo: EstadoLista, usuarioId: number, comentario: string | null = null) {
    return db.transaction(async (trx) => {
      const lista = await InvLista.query({ client: trx }).where('id', listaId).forUpdate().firstOrFail()
      const iActual = ESTADOS.indexOf(lista.estado)
      const iNuevo = ESTADOS.indexOf(nuevo)

      if (iNuevo === iActual) throw new InvError(`La lista ${lista.folio} ya está en ${nuevo}`)
      if (iNuevo > iActual + 1) {
        throw new InvError(`${lista.folio}: no se puede saltar de ${lista.estado} a ${nuevo}. Siguiente: ${ESTADOS[iActual + 1]}`)
      }
      if (iNuevo < iActual && !comentario) {
        throw new InvError(`${lista.folio}: regresar a un estado anterior requiere comentario`)
      }
      if (nuevo === 'CONTEO' && !lista.equipoActualId) {
        throw new InvError(`${lista.folio}: asigna un equipo antes de entregar la lista`)
      }

      const t = ahora()
      await InvListaTransicion.create(
        { listaId: lista.id, estadoAnterior: lista.estado, estadoNuevo: nuevo, fecha: t, usuarioId, comentario },
        { client: trx }
      )
      lista.estado = nuevo
      lista.estadoDesde = t
      await lista.save()
      return lista
    })
  }

  async avanzar(listaId: number, usuarioId: number) {
    const lista = await InvLista.findOrFail(listaId)
    const i = ESTADOS.indexOf(lista.estado)
    if (i === ESTADOS.length - 1) throw new InvError(`La lista ${lista.folio} ya está FINALIZADO`)
    return this.cambiarEstado(listaId, ESTADOS[i + 1], usuarioId)
  }

  /**
   * Cambio masivo (ej. entregar todas las listas en la mañana).
   * Cada lista en su propia transacción: un error no bloquea a las demás.
   */
  async cambiarEstadoMasivo(listaIds: number[], nuevo: EstadoLista, usuarioId: number, comentario: string | null) {
    const exitosas: { listaId: number; folio: string }[] = []
    const errores: { listaId: number; mensaje: string }[] = []
    for (const listaId of listaIds) {
      try {
        const l = await this.cambiarEstado(listaId, nuevo, usuarioId, comentario)
        exitosas.push({ listaId, folio: l.folio })
      } catch (e: any) {
        errores.push({ listaId, mensaje: e instanceof InvError ? e.message : e?.code === 'E_ROW_NOT_FOUND' ? 'No existe' : 'Error interno' })
      }
    }
    return { exitosas, errores }
  }

  // ───────────────────────── AJUSTES ─────────────────────────

  /** Recibe montos en valor absoluto; el servicio aplica el signo. */
  async registrarAjuste(listaId: number, sobrante: number, faltante: number) {
    const lista = await InvLista.findOrFail(listaId)
    if (ESTADOS.indexOf(lista.estado) < ESTADOS.indexOf(ESTADO_MIN_AJUSTE)) {
      throw new InvError(`${lista.folio}: el ajuste se captura a partir de ${ESTADO_MIN_AJUSTE} (estado actual: ${lista.estado})`)
    }
    lista.ajustePositivo = Math.abs(sobrante)
    lista.ajusteNegativo = -Math.abs(faltante)
    await lista.save()
    return lista
  }

  // ───────────────────────── ASIGNACIÓN ─────────────────────────

  async reasignar(listaIds: number[], equipoId: number, motivo: string, usuarioId: number) {
    return db.transaction((trx) => this.reasignarEnTrx(trx, listaIds, equipoId, motivo, usuarioId))
  }

  /** Apoyo por localidad: todas sus listas no finalizadas pasan al equipo destino. */
  async reasignarLocalidad(localidadId: number, equipoId: number, motivo: string, usuarioId: number) {
    return db.transaction(async (trx) => {
      await InvLocalidad.query({ client: trx }).where('id', localidadId).firstOrFail()
      const filas = await trx.from('inv_lista_localidad').where('localidad_id', localidadId).select('lista_id')
      if (!filas.length) throw new InvError('La localidad no tiene listas ligadas')
      return this.reasignarEnTrx(trx, filas.map((f) => f.lista_id), equipoId, motivo, usuarioId)
    })
  }

  /** Apoyo por equipo: las listas pendientes del origen pasan al destino. */
  async reasignarEquipo(
    origenId: number,
    destinoId: number,
    motivo: string,
    usuarioId: number,
    estados: EstadoLista[] | null
  ) {
    if (origenId === destinoId) throw new InvError('El equipo origen y destino son el mismo')
    return db.transaction(async (trx) => {
      const q = InvLista.query({ client: trx }).where('equipo_actual_id', origenId).whereNot('estado', 'FINALIZADO')
      if (estados?.length) q.whereIn('estado', estados)
      const listas = await q.select('id')
      if (!listas.length) throw new InvError('El equipo origen no tiene listas pendientes con ese criterio')
      return this.reasignarEnTrx(trx, listas.map((l) => l.id), destinoId, motivo, usuarioId)
    })
  }

  private async reasignarEnTrx(trx: Trx, listaIds: number[], equipoId: number, motivo: string, usuarioId: number) {
    await this.validarEquipoActivo(equipoId, trx)

    const listas = await InvLista.query({ client: trx }).whereIn('id', listaIds).forUpdate()
    const existentes = new Set(listas.map((l) => l.id))
    const noExisten = listaIds.filter((i) => !existentes.has(i))
    if (noExisten.length) throw new InvError(`Listas inexistentes: ${noExisten.join(', ')}`, 404)

    const t = ahora()
    const reasignadas: { listaId: number; folio: string; equipoAnteriorId: number | null }[] = []
    const omitidas: Omitida[] = []

    for (const lista of listas) {
      if (lista.estado === 'FINALIZADO') {
        omitidas.push({ listaId: lista.id, folio: lista.folio, razon: 'Ya está finalizada' })
        continue
      }
      if (lista.equipoActualId === equipoId) {
        omitidas.push({ listaId: lista.id, folio: lista.folio, razon: 'Ya pertenece a ese equipo' })
        continue
      }

      await InvListaAsignacion.query({ client: trx })
        .where('lista_id', lista.id)
        .whereNull('fin')
        .update({ fin: aSql(t) })

      await InvListaAsignacion.create(
        { listaId: lista.id, equipoId, inicio: t, fin: null, motivo, usuarioId },
        { client: trx }
      )

      reasignadas.push({ listaId: lista.id, folio: lista.folio, equipoAnteriorId: lista.equipoActualId })
      lista.equipoActualId = equipoId
      await lista.save()
    }
    return { reasignadas, omitidas }
  }

  // ───────────────────────── CONSULTA ─────────────────────────

  /** Detalle + equipo original + tiempos por fase (incluye retrocesos). */
  async historial(listaId: number) {
    const lista = await InvLista.query()
      .where('id', listaId)
      .preload('equipoActual')
      .preload('localidades', (q) => q.preload('area').preload('equipoPlaneado'))
      .preload('asignaciones', (q) => q.preload('equipo').orderBy('inicio', 'asc').orderBy('id', 'asc'))
      .preload('transiciones', (q) => q.orderBy('fecha', 'asc').orderBy('id', 'asc'))
      .firstOrFail()

    const t = ahora()
    const minutosPorEstado: Partial<Record<EstadoLista, number>> = {}
    lista.transiciones.forEach((tr, i) => {
      if (tr.estadoNuevo === 'FINALIZADO') return
      const fin = lista.transiciones[i + 1]?.fecha ?? t
      minutosPorEstado[tr.estadoNuevo] = (minutosPorEstado[tr.estadoNuevo] ?? 0) + minutosEntre(tr.fecha, fin)
    })

    return {
      lista,
      equipoOriginal: lista.asignaciones[0]?.equipo ?? null,
      minutosEnEstadoActual: lista.estado === 'FINALIZADO' ? null : minutosEntre(lista.estadoDesde, t),
      minutosPorEstado,
    }
  }

  // ───────────────────────── AUXILIARES ─────────────────────────

  /** Quita duplicados y garantiza exactamente una localidad principal. */
  private normalizarLocalidades(input: LocalidadInput[]): LocalidadInput[] {
    if (!Array.isArray(input) || input.length === 0) throw new InvError('La lista debe tener al menos una localidad')
    const mapa = new Map<number, boolean>()
    for (const l of input) mapa.set(l.localidadId, Boolean(mapa.get(l.localidadId)) || Boolean(l.principal))
    const res = [...mapa].map(([localidadId, principal]) => ({ localidadId, principal }))
    const principales = res.filter((l) => l.principal).length
    if (principales === 0 && res.length === 1) res[0].principal = true
    else if (principales !== 1) throw new InvError('Marca exactamente una localidad como principal')
    return res
  }

  private async cargarLocalidades(localidades: LocalidadInput[], trx: Trx) {
    const locs = await InvLocalidad.query({ client: trx }).whereIn('id', localidades.map((l) => l.localidadId))
    if (locs.length !== localidades.length) throw new InvError('Una o más localidades no existen', 404)
    return locs
  }

  /** La lista debe venir cargada/creada con el cliente de la transacción. */
  private async sincronizarLocalidades(lista: InvLista, localidades: LocalidadInput[]) {
    const payload: Record<number, { es_principal: number }> = {}
    for (const l of localidades) payload[l.localidadId] = { es_principal: l.principal ? 1 : 0 }
    await lista.related('localidades').sync(payload)
  }

  private async validarEquipoActivo(equipoId: number, trx: Trx) {
    const equipo = await InvEquipo.query({ client: trx }).where('id', equipoId).first()
    if (!equipo) throw new InvError('El equipo no existe', 404)
    if (!equipo.activo) throw new InvError(`${equipo.nombre} está inactivo`)
  }
}
