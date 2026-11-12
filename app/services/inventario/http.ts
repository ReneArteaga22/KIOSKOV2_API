import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { InvError } from '#exceptions/inv_error'

type Response = HttpContext['response']

export function ok(response: Response, mensaje: string, data: unknown = null, status = 200) {
  return response.status(status).json({ success: true, titulo: 'Éxito', mensaje, data })
}

export function responderError(response: Response, error: any) {
  const fallo = (status: number, titulo: string, mensaje: string) =>
    response.status(status).json({ success: false, titulo, mensaje })

  if (error instanceof InvError) return fallo(error.status, 'Validación', error.message)

  switch (error?.code) {
    case 'E_ROW_NOT_FOUND':
      return fallo(404, 'No encontrado', 'Registro no encontrado')
    case 'ER_DUP_ENTRY':
      return fallo(409, 'Duplicado', 'Ya existe un registro con ese valor (folio, nombre o código)')
    case 'ER_ROW_IS_REFERENCED':
    case 'ER_ROW_IS_REFERENCED_2':
      return fallo(409, 'En uso', 'No se puede eliminar: el registro está en uso')
    case 'ER_NO_REFERENCED_ROW':
    case 'ER_NO_REFERENCED_ROW_2':
      return fallo(422, 'Referencia inválida', 'Uno de los registros relacionados no existe')
  }

  logger.error(error, 'Error inventario')
  return fallo(500, 'Error', 'Error interno del servidor')
}
