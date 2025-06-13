import Avance from '#models/avance'
import Observacion from '#models/observacion'
import Equipo from '#models/equipo'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class AvancesController {
  // POST /api/avances
  async registrar({ request, response }: HttpContext) {
    try {
      const { equipoId, porcentajeAvance } = request.body()

      // 1. Crear avance
      const avance = new Avance()
      avance.equipoId = equipoId
      avance.porcentajeAvance = porcentajeAvance
      avance.fecha = DateTime.local()

      await avance.save()

      return response.status(200).json({
        titulo: 'Éxito',
        mensaje: 'Avance registrado correctamente',
        avance
      })

  } catch (error) {
      return response.status(400).json({
        titulo: 'Error',
        mensaje: error.message
      })
    }
  }

  // GET /api/avances
  async verTodos({ response }: HttpContext) {
    try {
      const avances = await Avance.query()
        .preload('equipo')
        .orderBy('fecha', 'desc')

      return response.status(200).json({
        titulo: 'Éxito',
        avances
      })
    } catch (error) {
      return response.status(500).json({
        titulo: 'Error',
        mensaje: error.message
      })
    }
  }

  // POST /api/avances/equipo
  async verPorEquipo({ request, response }: HttpContext) {
    try {
      const { equipoId } = request.body()

      const avances = await Avance.query()
        .where('equipo_id', equipoId)
        .preload('equipo')
        .orderBy('fecha', 'desc')

      const observaciones = await Observacion.query()
        .where('equipo_id', equipoId)
        .orderBy('fecha', 'desc')

      return response.status(200).json({
        titulo: 'Éxito',
        avances,
        observaciones
      })
    } catch (error) {
      return response.status(400).json({
        titulo: 'Error',
        mensaje: error.message
      })
    }
  }
}
