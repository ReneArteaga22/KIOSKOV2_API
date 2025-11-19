import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import InventarioLocalidad from '#models/inventario_localidad'
import { DateTime } from 'luxon'

export default class DashboardInventariosController {
  /**
   * GET /api/dashboard/inventario
   * Obtiene todos los equipos con sus localidades, miembros y estadísticas
   */
  async index({ response }: HttpContext) {
    try {
      const equipos = await User.query()
        .where('area', 'inventario')
        .where('estatus', 'activo')
        .preload('localidades', (query) => {
          query.orderBy('localidad_nombre', 'asc')
        })
        .orderBy('nombre', 'asc')

      // Mapear los datos para el formato esperado por el frontend
      const avances = equipos.map((equipo) => {
        // ======================================================
        // AÑADIDO: Variable para sumar el ajuste del equipo
        // ======================================================
        let totalAjusteEquipo = 0

        const localidades = equipo.localidades.map((loc) => {
          const total = Number(loc.dineroTotal)
          const encontrado = Number(loc.dineroEncontrado)
          const ajuste = Number(loc.dineroAjuste)

          // ======================================================
          // AÑADIDO: Sumar el ajuste de esta localidad al total
          // ======================================================
          totalAjusteEquipo += ajuste

          return {
            id: loc.id,
            nombre: loc.localidadNombre,
            estatus: loc.estatus,
            categoria: loc.categoria,
            porcentaje: this.getPorcentajeByEstatus(loc.estatus),
            dinero: {
              total: total,
              encontrado: encontrado,
              noEncontrado: ajuste, // Usamos el valor de ajuste de la BD
              ajuste: ajuste,
            },
            horaActualizacion: DateTime.fromJSDate(loc.ultimaActualizacion.toJSDate())
              .setZone('America/Mexico_City')
              .toFormat('HH:mm'),
          }
        })

        // Calcular promedio de avance del equipo
        const promedioAvance = this.calcularPromedioEquipo(localidades)

        return {
          id: equipo.id,
          nombre: equipo.nombre,
          apellidos: equipo.apellidos,
          usuario: equipo.usuario,
          miembros: equipo.miembros || [],
          localidades: localidades,
          promedioAvance: promedioAvance,
          // ======================================================
          // AÑADIDO: Devolver el total de ajuste del equipo
          // ======================================================
          totalAjusteEquipo: totalAjusteEquipo,
          hora: DateTime.now().setZone('America/Mexico_City').toFormat('HH:mm'),
        }
      })

      // Calcular promedio general
      const promedioGeneral = this.calcularPromedioGeneral(avances)

      // ======================================================
      // AÑADIDO: Calcular el Ajuste Total General
      // ======================================================
      const totalesDinero = await InventarioLocalidad.query()
        .sum('dinero_ajuste as ajuste')
        .first()
      const totalAjusteGeneral = Number(totalesDinero?.$extras.ajuste || 0)

      return response.status(200).json({
        success: true,
        avances: avances,
        estadisticas: {
          totalEquipos: avances.length,
          promedioGeneral: promedioGeneral,
          // ======================================================
          // AÑADIDO: Devolver el ajuste total general
          // ======================================================
          totalAjusteGeneral: totalAjusteGeneral,
          timestamp: DateTime.now().setZone('America/Mexico_City').toISO(),
        },
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        titulo: 'Error',
        mensaje: error.message,
      })
    }
  }

  /**
   * GET /api/dashboard/inventario/:id
   * Obtiene un equipo específico con sus localidades
   */
  async show({ params, response }: HttpContext) {
    try {
      const equipo = await User.query()
        .where('id', params.id)
        .where('area', 'inventario')
        .preload('localidades', (query) => {
          query.orderBy('localidad_nombre', 'asc')
        })
        .firstOrFail()

      // ======================================================
      // AÑADIDO: Variable para sumar el ajuste
      // ======================================================
      let totalAjusteEquipo = 0

      const localidades = equipo.localidades.map((loc) => {
        const total = Number(loc.dineroTotal)
        const encontrado = Number(loc.dineroEncontrado)
        // Ajuste = No Encontrado (Faltante)
        const ajuste = Number(loc.dineroAjuste)

        // ======================================================
        // AÑADIDO: Sumar el ajuste de esta localidad al total
        // ======================================================
        totalAjusteEquipo += ajuste

        return {
          id: loc.id,
          nombre: loc.localidadNombre,
          estatus: loc.estatus,
          categoria: loc.categoria,
          porcentaje: this.getPorcentajeByEstatus(loc.estatus),
          dinero: {
            total: total,
            encontrado: encontrado,
            noEncontrado: ajuste, // Ajuste ES el dinero no encontrado
          },
          horaActualizacion: DateTime.fromJSDate(loc.ultimaActualizacion.toJSDate())
            .setZone('America/Mexico_City')
            .toFormat('HH:mm'),
        }
      })

      const promedioAvance = this.calcularPromedioEquipo(localidades)

      return response.status(200).json({
        success: true,
        equipo: {
          id: equipo.id,
          nombre: equipo.nombre,
          apellidos: equipo.apellidos,
          usuario: equipo.usuario,
          miembros: equipo.miembros || [],
          localidades: localidades,
          promedioAvance: promedioAvance,
          // ======================================================
          // AÑADIDO: Devolver el total de ajuste del equipo
          // ======================================================
          totalAjusteEquipo: totalAjusteEquipo,
          hora: DateTime.now().setZone('America/Mexico_City').toFormat('HH:mm'),
        },
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        titulo: 'Error',
        mensaje: 'Equipo no encontrado',
      })
    }
  }

  /**
   * GET /api/dashboard/estadisticas
   * Obtiene estadísticas globales del inventario
   */
  async estadisticas({ response }: HttpContext) {
    try {
      const totalLocalidades = await InventarioLocalidad.query().count('* as total')

      // Consulta actualizada para incluir sumas de dinero por estatus
      const localidadesPorEstatus = await InventarioLocalidad.query()
        .select('estatus')
        .count('* as cantidad')
        .sum('dinero_total as total')
        .sum('dinero_encontrado as encontrado')
        .sum('dinero_ajuste as ajuste')
        .groupBy('estatus')

      const totalesDinero = await InventarioLocalidad.query()
        .sum('dinero_total as total')
        .sum('dinero_encontrado as encontrado')
        .sum('dinero_ajuste as ajuste')
        .first() // .first() es correcto aquí

      // Extraer los totales del objeto $extras
      const dineroTotal = Number(totalesDinero?.$extras.total || 0)
      const dineroEncontrado = Number(totalesDinero?.$extras.encontrado || 0)
      const dineroAjuste = Number(totalesDinero?.$extras.ajuste || 0)

      return response.status(200).json({
        success: true,
        estadisticas: {
          totalLocalidades: totalLocalidades[0].$extras.total,
          // Mapeo actualizado para incluir el dinero por estatus
          localidadesPorEstatus: localidadesPorEstatus.map((item) => {
            const total = Number(item.$extras.total || 0)
            const encontrado = Number(item.$extras.encontrado || 0)
            const ajuste = Number(item.$extras.ajuste || 0)

            return {
              estatus: item.estatus,
              cantidad: item.$extras.cantidad,
              porcentaje: this.getPorcentajeByEstatus(item.estatus),
              dinero: {
                total: total,
                encontrado: encontrado,
                noEncontrado: ajuste, // Asumimos que 'ajuste' es 'noEncontrado'
              },
            }
          }),
          dineroGlobal: {
            total: dineroTotal,
            encontrado: dineroEncontrado,
            noEncontrado: dineroAjuste, // Asumimos que 'ajuste' es 'noEncontrado'
            ajuste: dineroAjuste,
          },
        },
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        titulo: 'Error',
        mensaje: error.message,
      })
    }
  }

  // ==================== MÉTODOS AUXILIARES ====================

  /**
   * Obtiene el porcentaje según el estatus
   */
  private getPorcentajeByEstatus(estatus: string): number {
    switch (estatus) {
      case 'CONTEO':
        return 0
      case 'CAPTURA':
        return 50
      case 'VALIDACION':
        return 90
      case 'FINALIZADO':
        return 100
      default:
        return 0
    }
  }

  /**
   * Calcula el promedio de avance de un equipo
   */
  private calcularPromedioEquipo(localidades: any[]): number {
    if (localidades.length === 0) return 0

    const suma = localidades.reduce((total, loc) => total + loc.porcentaje, 0)
    return Math.round(suma / localidades.length)
  }

  /**
   * Calcula el promedio general de todos los equipos
   */
  private calcularPromedioGeneral(equipos: any[]): number {
    if (equipos.length === 0) return 0

    const suma = equipos.reduce((total, equipo) => total + equipo.promedioAvance, 0)
    return Math.round(suma / equipos.length)
  }
}