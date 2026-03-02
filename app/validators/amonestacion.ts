import vine, { SimpleMessagesProvider } from '@vinejs/vine'


export default class AmonestacionValidator {
public schema = vine.object({
    fecha: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    hora: vine.string().maxLength(5),
    planta: vine.string().maxLength(50),
    departamento: vine.string().maxLength(80), 
    noEmpleado: vine.string().maxLength(20),
    nombre: vine.string().maxLength(150),
    puesto: vine.string().maxLength(100),
    reporta: vine.string().maxLength(150),
    motivo: vine.string(),
  });


public messages = {
 
  'fecha.required': 'La fecha es obligatoria.',
  'fecha.regex': 'El formato de fecha debe ser YYYY-MM-DD.',
  'planta.required': 'La planta es obligatoria.',
  'noEmpleado.required': 'El número de empleado es obligatorio.',
  'nombre.required': 'El nombre es obligatorio.',
  
  
  'required': 'El campo {{ field }} es obligatorio.',
  'maxLength': 'El campo {{ field }} no puede tener más de {{ rule.maxLength }} caracteres.'
}
}