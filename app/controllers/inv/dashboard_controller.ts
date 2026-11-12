import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import DashboardService from '#services/inventario/dashboard_service'
import InventarioService from '#services/inventario/inventario_service'
import { UMBRAL_DETENIDA_MIN } from '#services/inventario/constantes'
import { ok, responderError } from '#services/inventario/http'

/** Endpoints PÚBLICOS de solo lectura. */
@inject()
export default class DashboardController {
  constructor(
    protected dashboard: DashboardService,
    protected inventario: InventarioService
  ) {}

  /** GET /api/inv/dashboard?umbral=45 */
  async index({ request, response }: HttpContext) {
    try {
      const u = Number(request.qs().umbral)
      const umbral = Number.isInteger(u) && u > 0 && u <= 1440 ? u : UMBRAL_DETENIDA_MIN
      return ok(response, 'Dashboard', await this.dashboard.snapshot(umbral))
    } catch (e) {
      return responderError(response, e)
    }
  }

  /** GET /api/inv/dashboard/listas/:id — quién la tiene, quién la tenía, tiempos por fase. */
  async lista({ params, response }: HttpContext) {
    try {
      return ok(response, 'Lista', await this.inventario.historial(Number(params.id)))
    } catch (e) {
      return responderError(response, e)
    }
  }
}
