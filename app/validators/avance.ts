import vine from '@vinejs/vine'
import type { FieldContext } from '@vinejs/vine/types'

// Definimos tipos para nuestros mensajes personalizados
type CustomMessages = {
  'equipo_id.exists': string
  'porcentaje_avance.min': string
  'porcentaje_avance.max': string
  'comentario.maxLength': string
  'required': string
  'number': string
  [key: string]: string // Índice de firma para otros mensajes
}

const customMessages: CustomMessages = {
  'equipo_id.exists': 'El equipo no existe en la base de datos',
  'porcentaje_avance.min': 'El porcentaje mínimo permitido es 0%',
  'porcentaje_avance.max': 'El porcentaje máximo permitido es 100%',
  'comentario.maxLength': 'El comentario no puede exceder los 500 caracteres',
  'required': 'El campo {{ field }} es requerido',
  'number': 'El campo {{ field }} debe ser un número válido'
}

// Configuración del proveedor de mensajes
vine.messagesProvider = {
  getMessage(
    defaultMessage: string,
    rule: string,
    field: FieldContext,
    args?: Record<string, any>
  ): string {
    const fieldName = field.name
    const messageKey = `${fieldName}.${rule}` as const
    
    // Busca primero mensaje específico para campo.regla
    // Luego mensaje genérico para la regla
    // Finalmente el mensaje por defecto
    return customMessages[messageKey] || 
           customMessages[rule] || 
           defaultMessage
  }
}

// Esquema de validación
const avanceSchema = vine.object({
  equipo_id: vine.number().exists(async (db, value) => {
    return await db.from('equipos').where('id', value).first()
  }),
  porcentaje_avance: vine.number().min(0).max(100),
  comentario: vine.string().trim().maxLength(500).optional()
})

// Validador compilado
export const avanceValidator = vine.compile(avanceSchema)