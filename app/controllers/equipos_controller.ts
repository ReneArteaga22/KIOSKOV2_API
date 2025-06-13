// app/Controllers/Http/EquiposController.ts
import { HttpContext } from '@adonisjs/core/http'
import Equipo from '#models/equipo'
import Avance from '#models/avance'
import Observacion from '#models/observacion'

export default class EquiposController {
  /**
   * Listar todos los equipos
   */
  async index({ response }: HttpContext) {
    try {
      const equipos = await Equipo.all()
      return response.ok(equipos)
    } catch (error) {
      return response.internalServerError({
        message: 'Error al obtener los equipos',
      })
    }
  }

  /**
   * Crear un nuevo equipo
   */
  async store({ request, response }: HttpContext) {
    const data = request.only(['nombre', 'planta'])

    try {
      // Validar que la planta sea correcta
      if (data.planta !== 'Planta 1' && data.planta !== 'Planta 2') {
        return response.badRequest({
          message: 'La planta debe ser "Planta 1" o "Planta 2"',
        })
      }

      const equipo = await Equipo.create(data)
      return response.created(equipo)
    } catch (error) {
      return response.internalServerError({
        message: 'Error al crear el equipo',
      })
    }
  }

  /**
   * Mostrar un equipo específico con sus avances y observaciones
   */
  async show({ params, response }: HttpContext) {
    try {
      const equipo = await Equipo.query()
        .where('id', params.id)
        .preload('avances', (query) => {
          query.orderBy('fecha', 'desc')
        })
        .preload('observaciones', (query) => {
          query.orderBy('fecha', 'desc')
        })
        .firstOrFail()

      return response.ok(equipo)
    } catch (error) {
      return response.notFound({ message: 'Equipo no encontrado' })
    }
  }

  /**
   * Actualizar un equipo
   */
  async update({ params, request, response }: HttpContext) {
    const data = request.only(['nombre', 'planta'])

    try {
      const equipo = await Equipo.findOrFail(params.id)

      if (data.planta && data.planta !== 'Planta 1' && data.planta !== 'Planta 2') {
        return response.badRequest({
          message: 'La planta debe ser "Planta 1" o "Planta 2"',
        })
      }

      equipo.merge(data)
      await equipo.save()

      return response.ok(equipo)
    } catch (error) {
      return response.notFound({ message: 'Equipo no encontrado' })
    }
  }

  /**
   * Eliminar un equipo (y sus avances/observaciones por CASCADE)
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const equipo = await Equipo.findOrFail(params.id)
      await equipo.delete()

      return response.noContent()
    } catch (error) {
      return response.notFound({ message: 'Equipo no encontrado' })
    }
  }

  /**
   * Obtener el progreso general de todos los equipos
   */
  async progresoGeneral({ response }: HttpContext) {
    try {
      const equipos = await Equipo.query()
        .preload('avances', (query) => {
          query.orderBy('fecha', 'desc').limit(1) // Último avance
        })
        .preload('observaciones', (query) => {
          query.orderBy('fecha', 'desc').limit(5) // Últimas 5 observaciones
        })

      return response.ok(equipos)
    } catch (error) {
      return response.internalServerError({
        message: 'Error al obtener el progreso general',
      })
    }
  }
}