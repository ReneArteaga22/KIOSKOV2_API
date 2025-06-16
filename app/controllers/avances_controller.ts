import Avance from '#models/avance'
import Observacion from '#models/observacion'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class AvancesController {
  // POST /api/avances
  async actualizarAvance({ request, response }: HttpContext) {
     const now = DateTime.now().setZone('America/Mexico_City');
      const horaMexico = now.toFormat('HH:mm:ss');
     console.log(horaMexico)
    try {
      const { userId, porcentajeAvance } = request.body()

      // 1. Crear avance
      const avance = await Avance.query()
      .where('user_id',userId)
      .first()

      if(avance)
      {
        await avance.merge({
          porcentajeAvance:porcentajeAvance,
          hora:horaMexico
        }).save()
        return response.status(200).json({
          msg: 'Avance registrado correctamente',
          data:avance
        })
      }

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
        .preload('user')
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
      const { userId} = request.body()

      const avances = await Avance.query()
        .where('user_id', userId)
        .preload('user')
        .orderBy('fecha', 'desc')

      const observaciones = await Observacion.query()
        .where('user_id', userId)
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
