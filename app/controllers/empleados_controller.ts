import type { HttpContext } from '@adonisjs/core/http'
import Empleado from '#models/empleado'

export default class EmpleadosController {

  private readonly plantaMap: Record<string, string> = {
    'UP1': 'Planta 1',
    'UP2': 'Planta 2',
  }

  private mapEmpleado(e: Empleado) {
    return {
      noEmpleado:   String(e.Numero),
      nombre:       [e.FirstName, e.MiddleName, e.Surname]
                      .filter(Boolean)
                      .join(' ')
                      .trim(),
      puesto:       e.JobTitleSpanish                           ?? '',
      departamento: e.Department                               ?? '',
      planta:       e.Plant ? (this.plantaMap[e.Plant] ?? e.Plant) : '',
      turno:        e.Shift                                    ?? '',
      matx3:        e.matx3                                    ?? '',
      activo:       e.Activo                                   ?? 'SI',
    }
  }

  // GET /api/empleados?q=<término>
  public async index({ request, response }: HttpContext) {
    try {
      const { q } = request.qs()

      const query = Empleado.query()
        .where('Activo', 'SI')        // columnName declarado → usa 'Activo' exacto
        .whereNotNull('Plant')
        .orderBy('Numero', 'asc')
        .limit(15)

      if (q) {
        const term       = `%${q}%`
        const esNumero   = /^\d+$/.test(q.trim())

        query.where((sub) => {
          if (esNumero) {
            sub
              .whereRaw('CAST(`Numero` AS CHAR) LIKE ?', [term])
              .orWhereRaw('`FirstName` LIKE ?',  [term])
              .orWhereRaw('`Surname`   LIKE ?',  [term])
              .orWhereRaw('`matx3`     LIKE ?',  [term])
          } else {
            sub
              .whereRaw('`FirstName` LIKE ?', [term])
              .orWhereRaw('`Surname`  LIKE ?', [term])
              .orWhereRaw('`matx3`    LIKE ?', [term])
          }
        })
      }

      const empleados = await query

      return response.ok({
        status: 'success',
        data:   empleados.map(e => this.mapEmpleado(e)),
      })

    } catch (error) {
      console.error('[EmpleadosController.index]', error)
      return response.internalServerError({
        status:  'error',
        message: 'Ocurrió un error al extraer los empleados',
      })
    }
  }

  // GET /api/empleados/:numero
  public async show({ params, response }: HttpContext) {
    try {
      const empleado = await Empleado.query()
        .where('Numero', params.numero)
        .where('Activo', 'SI')
        .first()

      if (!empleado) {
        return response.notFound({
          status:  'error',
          message: 'Empleado no encontrado',
        })
      }

      return response.ok({
        status: 'success',
        data:   this.mapEmpleado(empleado),
      })

    } catch (error) {
      console.error('[EmpleadosController.show]', error)
      return response.internalServerError({
        status:  'error',
        message: 'Ocurrió un error al buscar al empleado',
      })
    }
  }
}