import { HttpContext } from '@adonisjs/core/http'
import Equipo from '#models/equipo'

export default class DashboardController {
  async index({ response }: HttpContext) {
    const equipos = await Equipo.query()
      .preload('avances', (query) => {
        query.orderBy('fecha', 'desc').limit(1)
      })
      .preload('observaciones', (query) => {
        query.orderBy('fecha', 'desc').limit(3)
      })

    return response.ok(equipos)
  }
}