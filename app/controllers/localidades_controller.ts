import type { HttpContext } from '@adonisjs/core/http'
import InventarioLocalidad from '#models/inventario_localidad'
import { DateTime } from 'luxon'

export default class LocalidadesController {
  /**
   * GET /api/localidades
   * Obtener todas las localidades
   */
  async index({ response }: HttpContext) {
    try {
      const localidades = await InventarioLocalidad.query()
        .preload('user')
        .orderBy('user_id', 'asc')
        .orderBy('localidad_nombre', 'asc')

      return response.status(200).json({
        success: true,
        localidades: localidades,
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
   * GET /api/localidades/:id
   * Obtener una localidad específica
   */
  async show({ params, response }: HttpContext) {
    try {
      const localidad = await InventarioLocalidad.query()
        .where('id', params.id)
        .preload('user')
        .firstOrFail()

      return response.status(200).json({
        success: true,
        localidad: localidad,
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        titulo: 'Error',
        mensaje: 'Localidad no encontrada',
      })
    }
  }

  /**
   * POST /api/localidades
   * Crear una nueva localidad
   */
  async store({ request, response }: HttpContext) {
    try {
      const {
        userId,
        localidadNombre,
        estatus,
        dineroTotal,
        dineroEncontrado,
        dineroAjuste,
      } = request.body()

      // Validaciones básicas
      if (!userId || !localidadNombre) {
        return response.status(400).json({
          success: false,
          titulo: 'Error',
          mensaje: 'userId y localidadNombre son requeridos',
        })
      }

      const localidad = await InventarioLocalidad.create({
        userId: userId,
        localidadNombre: localidadNombre,
        estatus: estatus || 'CONTEO',
        dineroTotal: dineroTotal || 0,
        dineroEncontrado: dineroEncontrado || 0,
        dineroAjuste: dineroAjuste || 0,
      })

      return response.status(201).json({
        success: true,
        titulo: 'Éxito',
        mensaje: 'Localidad creada correctamente',
        localidad: localidad,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        titulo: 'Error',
        mensaje: error.message,
      })
    }
  }

  /**
   * PUT /api/localidades/:id
   * Actualizar una localidad existente
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const localidad = await InventarioLocalidad.findOrFail(params.id)

      const {
        localidadNombre,
        estatus,
        dineroTotal,
        dineroEncontrado,
        dineroAjuste,
      } = request.body()

      // Actualizar solo los campos proporcionados
      if (localidadNombre !== undefined) localidad.localidadNombre = localidadNombre
      if (estatus !== undefined) localidad.estatus = estatus
      if (dineroTotal !== undefined) localidad.dineroTotal = dineroTotal
      if (dineroEncontrado !== undefined) localidad.dineroEncontrado = dineroEncontrado
      if (dineroAjuste !== undefined) localidad.dineroAjuste = dineroAjuste

      await localidad.save()

      return response.status(200).json({
        success: true,
        titulo: 'Éxito',
        mensaje: 'Localidad actualizada correctamente',
        localidad: localidad,
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        titulo: 'Error',
        mensaje: 'Localidad no encontrada',
      })
    }
  }

  /**
   * PATCH /api/localidades/:id/estatus
   * Actualizar estatus y dinero de una localidad (LO QUE MÁS USARÁS)
   */
  async updateEstatus({ params, request, response }: HttpContext) {
    try {
      const localidad = await InventarioLocalidad.findOrFail(params.id)
      const { estatus, dineroEncontrado, dineroAjuste } = request.body()

      // Validar que al menos uno de los campos venga
      if (!estatus && dineroEncontrado === undefined && dineroAjuste === undefined) {
        return response.status(400).json({
          success: false,
          titulo: 'Error',
          mensaje: 'Debes proporcionar al menos: estatus, dineroEncontrado o dineroAjuste',
        })
      }

      // Actualizar estatus si viene
      if (estatus) {
        const estatusValidos = ['CONTEO', 'CAPTURA', 'VALIDACION', 'FINALIZADO']
        if (!estatusValidos.includes(estatus)) {
          return response.status(400).json({
            success: false,
            titulo: 'Error',
            mensaje: 'Estatus no válido. Debe ser: CONTEO, CAPTURA, VALIDACION o FINALIZADO',
          })
        }
        localidad.estatus = estatus
      }

      // Actualizar dinero encontrado si viene
      if (dineroEncontrado !== undefined) {
        localidad.dineroEncontrado = dineroEncontrado
      }

      // Actualizar ajuste (dinero no encontrado) si viene
      if (dineroAjuste !== undefined) {
        localidad.dineroAjuste = dineroAjuste
      }

      await localidad.save()

      return response.status(200).json({
        success: true,
        titulo: 'Éxito',
        mensaje: 'Localidad actualizada correctamente',
        localidad: {
          id: localidad.id,
          nombre: localidad.localidadNombre,
          estatus: localidad.estatus,
          dinero: {
            total: Number(localidad.dineroTotal),
            encontrado: Number(localidad.dineroEncontrado),
            noEncontrado: Number(localidad.dineroAjuste)
          }
        },
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        titulo: 'Error',
        mensaje: 'Localidad no encontrada',
      })
    }
  }

  /**
   * PATCH /api/localidades/:id/quick-update
   * Actualización rápida de encontrado y ajuste (SIN cambiar estatus)
   */
  async quickUpdate({ params, request, response }: HttpContext) {
    try {
      const localidad = await InventarioLocalidad.findOrFail(params.id)
      const { dineroEncontrado, dineroAjuste } = request.body()

      if (dineroEncontrado === undefined && dineroAjuste === undefined) {
        return response.status(400).json({
          success: false,
          titulo: 'Error',
          mensaje: 'Debes proporcionar dineroEncontrado o dineroAjuste',
        })
      }

      if (dineroEncontrado !== undefined) {
        localidad.dineroEncontrado = dineroEncontrado
      }

      if (dineroAjuste !== undefined) {
        localidad.dineroAjuste = dineroAjuste
      }

      await localidad.save()

      return response.status(200).json({
        success: true,
        titulo: 'Éxito',
        mensaje: 'Dinero actualizado correctamente',
        localidad: {
          id: localidad.id,
          nombre: localidad.localidadNombre,
          estatus: localidad.estatus,
          dinero: {
            total: Number(localidad.dineroTotal),
            encontrado: Number(localidad.dineroEncontrado),
            noEncontrado: Number(localidad.dineroAjuste)
          }
        },
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        titulo: 'Error',
        mensaje: 'Localidad no encontrada',
      })
    }
  }

  /**
   * PATCH /api/localidades/:id/cambiar-estatus
   * Cambiar SOLO el estatus (sin tocar dinero)
   */
  async cambiarEstatus({ params, request, response }: HttpContext) {
    try {
      const localidad = await InventarioLocalidad.findOrFail(params.id)
      const { estatus } = request.body()

      if (!estatus) {
        return response.status(400).json({
          success: false,
          titulo: 'Error',
          mensaje: 'El estatus es requerido',
        })
      }

      const estatusValidos = ['CONTEO', 'CAPTURA', 'VALIDACION', 'FINALIZADO']
      if (!estatusValidos.includes(estatus)) {
        return response.status(400).json({
          success: false,
          titulo: 'Error',
          mensaje: 'Estatus no válido. Debe ser: CONTEO, CAPTURA, VALIDACION o FINALIZADO',
        })
      }

      localidad.estatus = estatus
      await localidad.save()

      return response.status(200).json({
        success: true,
        titulo: 'Éxito',
        mensaje: `Estatus cambiado a ${estatus}`,
        localidad: {
          id: localidad.id,
          nombre: localidad.localidadNombre,
          estatus: localidad.estatus,
          porcentaje: this.getPorcentajeByEstatus(estatus),
        },
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        titulo: 'Error',
        mensaje: 'Localidad no encontrada',
      })
    }
  }

  // ==================== MÉTODO AUXILIAR ====================
  private getPorcentajeByEstatus(estatus: string): number {
    switch (estatus) {
      case 'CONTEO':
        return 25
      case 'CAPTURA':
        return 50
      case 'VALIDACION':
        return 75
      case 'FINALIZADO':
        return 100
      default:
        return 0
    }
  }

  /**
   * DELETE /api/localidades/:id
   * Eliminar una localidad
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const localidad = await InventarioLocalidad.findOrFail(params.id)
      await localidad.delete()

      return response.status(200).json({
        success: true,
        titulo: 'Éxito',
        mensaje: 'Localidad eliminada correctamente',
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        titulo: 'Error',
        mensaje: 'Localidad no encontrada',
      })
    }
  }

  /**
   * GET /api/localidades/equipo/:userId
   * Obtener todas las localidades de un equipo específico
   */
  async porEquipo({ params, response }: HttpContext) {
    try {
      const localidades = await InventarioLocalidad.query()
        .where('user_id', params.userId)
        .orderBy('localidad_nombre', 'asc')

      return response.status(200).json({
        success: true,
        localidades: localidades,
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
   * GET /api/localidades/estatus/:estatus
   * Obtener todas las localidades por estatus
   */
  async porEstatus({ params, response }: HttpContext) {
    try {
      const localidades = await InventarioLocalidad.query()
        .where('estatus', params.estatus)
        .preload('user')
        .orderBy('user_id', 'asc')
        .orderBy('localidad_nombre', 'asc')

      return response.status(200).json({
        success: true,
        localidades: localidades,
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        titulo: 'Error',
        mensaje: error.message,
      })
    }
  }
}