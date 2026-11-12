import db from '@adonisjs/lucid/services/db'
import InvArea from '#models/inv_area'
import InvEquipo from '#models/inv_equipo'
import InvLocalidad from '#models/inv_localidad'
import InvLista from '#models/inv_lista'
import { ESTADOS, type EstadoLista } from './constantes.js'
import { ahora, minutosEntre } from './fechas.js'

type Conteo = Record<EstadoLista, number>
type Ajuste = { positivo: number; negativo: number; neto: number }

const r2 = (n: number) => Math.round(n * 100) / 100
const conteoVacio = (): Conteo => Object.fromEntries(ESTADOS.map((e) => [e, 0])) as Conteo
const ajusteVacio = (): Ajuste => ({ positivo: 0, negativo: 0, neto: 0 })

/**
 * Snapshot completo del inventario para el dashboard público.
 * Todo se calcula a partir de las listas (nada agregado se guarda).
 * Se calcula en JS y no con GROUP BY para evitar diferencias MariaDB/MySQL
 * (ONLY_FULL_GROUP_BY). Con cientos de listas es inmediato.
 */
export default class DashboardService {
  async snapshot(umbralMin: number) {
    const t = ahora()

    const [areas, equipos, localidades, listas, pivote, asignaciones] = await Promise.all([
      InvArea.query().orderBy('codigo'),
      InvEquipo.query().preload('integrantes', (q) => q.orderBy('rol').orderBy('nombre_completo')).orderBy('id'),
      InvLocalidad.query().orderBy('nombre'),
      InvLista.query().orderBy('folio'),
      db.from('inv_lista_localidad').select('lista_id', 'localidad_id', 'es_principal'),
      db.from('inv_lista_asignacion').select('lista_id', 'equipo_id').orderBy('inicio', 'asc').orderBy('id', 'asc'),
    ])

    const areaPorId = new Map(areas.map((a) => [a.id, a]))
    const equipoPorId = new Map(equipos.map((e) => [e.id, e]))
    const localidadPorId = new Map(localidades.map((l) => [l.id, l]))

    // Equipo original = primera asignación de cada lista
    const equipoOriginal = new Map<number, number>()
    for (const a of asignaciones) if (!equipoOriginal.has(a.lista_id)) equipoOriginal.set(a.lista_id, a.equipo_id)

    // Lista ↔ localidades
    const locsDeLista = new Map<number, { id: number; principal: boolean }[]>()
    const listasDeLocalidad = new Map<number, number[]>()
    for (const p of pivote) {
      const principal = Boolean(p.es_principal)
      if (!locsDeLista.has(p.lista_id)) locsDeLista.set(p.lista_id, [])
      locsDeLista.get(p.lista_id)!.push({ id: p.localidad_id, principal })
      if (!listasDeLocalidad.has(p.localidad_id)) listasDeLocalidad.set(p.localidad_id, [])
      listasDeLocalidad.get(p.localidad_id)!.push(p.lista_id)
    }

    // ───────── Listas (base de todo) ─────────
    const listasVm = listas.map((l) => {
      const locs = locsDeLista.get(l.id) ?? []
      const principalId = locs.find((x) => x.principal)?.id ?? locs[0]?.id ?? null
      const principal = principalId ? localidadPorId.get(principalId) : undefined
      const activa = l.estado !== 'SIN_ENTREGAR' && l.estado !== 'FINALIZADO'
      const minutosEnEstado = l.estado === 'FINALIZADO' ? null : minutosEntre(l.estadoDesde, t)
      const originalId = equipoOriginal.get(l.id) ?? null
      return {
        id: l.id,
        folio: l.folio,
        descripcion: l.descripcion,
        estado: l.estado,
        estadoDesde: l.estadoDesde.toISO(),
        minutosEnEstado,
        detenida: activa && (minutosEnEstado ?? 0) >= umbralMin,
        equipoActualId: l.equipoActualId,
        equipoActual: l.equipoActualId ? (equipoPorId.get(l.equipoActualId)?.nombre ?? null) : null,
        equipoOriginalId: originalId,
        equipoOriginal: originalId ? (equipoPorId.get(originalId)?.nombre ?? null) : null,
        reasignada: originalId !== null && originalId !== l.equipoActualId,
        localidadPrincipalId: principalId,
        areaId: principal?.areaId ?? null,
        localidades: locs.map((x) => ({
          id: x.id,
          nombre: localidadPorId.get(x.id)?.nombre ?? '?',
          principal: x.principal,
        })),
        ajuste: {
          positivo: r2(l.ajustePositivo),
          negativo: r2(l.ajusteNegativo),
          neto: r2(l.ajustePositivo + l.ajusteNegativo),
        },
      }
    })
    type ListaVm = (typeof listasVm)[number]
    const listaPorId = new Map(listasVm.map((l) => [l.id, l]))

    const agregar = (ls: ListaVm[]) => {
      const porEstado = conteoVacio()
      const ajuste = ajusteVacio()
      let detenidas = 0
      for (const l of ls) {
        porEstado[l.estado]++
        ajuste.positivo += l.ajuste.positivo
        ajuste.negativo += l.ajuste.negativo
        if (l.detenida) detenidas++
      }
      ajuste.positivo = r2(ajuste.positivo)
      ajuste.negativo = r2(ajuste.negativo)
      ajuste.neto = r2(ajuste.positivo + ajuste.negativo)
      const total = ls.length
      const finalizadas = porEstado.FINALIZADO
      return {
        total,
        finalizadas,
        pendientes: total - finalizadas,
        sinEntregar: porEstado.SIN_ENTREGAR,
        detenidas,
        avance: total ? Math.round((finalizadas / total) * 1000) / 10 : 0,
        porEstado,
        ajuste,
      }
    }

    /** Estado operativo calculado (para colores y filtros). */
    const estadoGeneral = (a: ReturnType<typeof agregar>) => {
      if (a.total === 0) return 'SIN_LISTAS'
      if (a.finalizadas === a.total) return 'TERMINADO'
      if (a.detenidas > 0) return 'ATENCION'
      if (a.sinEntregar === a.total) return 'SIN_INICIAR'
      return 'EN_PROCESO'
    }

    /** Estado más atrasado entre sus listas (para localidades). */
    const estadoMinimo = (ls: ListaVm[]): EstadoLista | null =>
      ls.length ? ESTADOS[Math.min(...ls.map((l) => ESTADOS.indexOf(l.estado)))] : null

    // ───────── Por equipo (listas que tiene AHORA) ─────────
    const porEquipo = equipos.map((e) => {
      const ls = listasVm.filter((l) => l.equipoActualId === e.id)
      const ag = agregar(ls)
      const planeadas = localidades.filter((l) => l.equipoPlaneadoId === e.id)
      const areaIds = new Set<number>()
      ls.forEach((l) => l.areaId && areaIds.add(l.areaId))
      planeadas.forEach((l) => areaIds.add(l.areaId))
      return {
        id: e.id,
        nombre: e.nombre,
        activo: e.activo,
        integrantes: e.integrantes.map((i) => ({ nombre: i.nombreCompleto, rol: i.rol })),
        areas: [...areaIds].map((id) => areaPorId.get(id)?.codigo ?? '?'),
        localidadesPlaneadas: planeadas.map((l) => l.nombre),
        estadoGeneral: estadoGeneral(ag),
        puedeApoyar: e.activo && ag.total > 0 && ag.pendientes === 0,
        recibidasDeOtros: ls.filter((l) => l.reasignada).length,
        cedidasAOtros: listasVm.filter((l) => l.equipoOriginalId === e.id && l.equipoActualId !== e.id).length,
        maxMinutosDetenida: Math.max(0, ...ls.filter((l) => l.detenida).map((l) => l.minutosEnEstado ?? 0)),
        ...ag,
        listas: ls,
      }
    })

    // ───────── Por localidad ─────────
    const porLocalidad = localidades.map((loc) => {
      const ls = (listasDeLocalidad.get(loc.id) ?? []).map((id) => listaPorId.get(id)!).filter(Boolean)
      const conteo = agregar(ls) // avance con todas sus listas
      const ajuste = agregar(ls.filter((l) => l.localidadPrincipalId === loc.id)).ajuste // sin duplicar
      return {
        id: loc.id,
        nombre: loc.nombre,
        areaId: loc.areaId,
        area: areaPorId.get(loc.areaId)?.codigo ?? '?',
        equipoPlaneado: loc.equipoPlaneadoId ? (equipoPorId.get(loc.equipoPlaneadoId)?.nombre ?? null) : null,
        equiposActuales: [...new Set(ls.map((l) => l.equipoActual).filter(Boolean))],
        estado: estadoMinimo(ls),
        estadoGeneral: estadoGeneral(conteo),
        total: conteo.total,
        finalizadas: conteo.finalizadas,
        pendientes: conteo.pendientes,
        sinEntregar: conteo.sinEntregar,
        detenidas: conteo.detenidas,
        avance: conteo.avance,
        porEstado: conteo.porEstado,
        ajuste,
        listas: ls.map((l) => ({ id: l.id, folio: l.folio, estado: l.estado, equipoActual: l.equipoActual, detenida: l.detenida })),
      }
    })

    // ───────── Por área (vía localidad principal) ─────────
    const porArea = areas.map((a) => {
      const ag = agregar(listasVm.filter((l) => l.areaId === a.id))
      return { id: a.id, codigo: a.codigo, nombre: a.nombre, estadoGeneral: estadoGeneral(ag), ...ag }
    })

    const global = agregar(listasVm)
    const activas = listasVm.filter((l) => l.estado !== 'SIN_ENTREGAR' && l.estado !== 'FINALIZADO')

    return {
      generadoEn: t.toISO(),
      umbralDetenidaMin: umbralMin,
      global: { ...global, estadoGeneral: estadoGeneral(global) },
      alertas: {
        detenidas: listasVm.filter((l) => l.detenida).sort((a, b) => (b.minutosEnEstado ?? 0) - (a.minutosEnEstado ?? 0)),
        sinEntregar: listasVm.filter((l) => l.estado === 'SIN_ENTREGAR'),
        sinEquipo: listasVm.filter((l) => !l.equipoActualId),
        localidadesSinLista: porLocalidad.filter((l) => l.total === 0).map((l) => ({ id: l.id, nombre: l.nombre, area: l.area })),
        equiposQuePuedenApoyar: porEquipo.filter((e) => e.puedeApoyar).map((e) => ({ id: e.id, nombre: e.nombre })),
        equiposConMasPendientes: porEquipo
          .filter((e) => e.pendientes > 0)
          .sort((a, b) => b.pendientes - a.pendientes)
          .slice(0, 5)
          .map((e) => ({ id: e.id, nombre: e.nombre, pendientes: e.pendientes, detenidas: e.detenidas, avance: e.avance })),
        mayoresAjustes: listasVm
          .filter((l) => l.ajuste.positivo !== 0 || l.ajuste.negativo !== 0)
          .sort((a, b) => Math.abs(b.ajuste.neto) - Math.abs(a.ajuste.neto))
          .slice(0, 10),
      },
      /** Listas activas por fase: dónde se acumula el trabajo ahora. */
      cuellos: Object.fromEntries((['CONTEO', 'CAPTURA', 'VALIDACION'] as const).map((e) => [e, activas.filter((l) => l.estado === e).length])),
      porArea,
      porEquipo,
      porLocalidad,
      listas: listasVm,
    }
  }
}
