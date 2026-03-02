import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Amonestacion extends BaseModel {
  public static table = 'amonestaciones'

  @column({ isPrimary: true })
  declare id: number

  @column.date()
  declare fecha: DateTime

  @column()
  declare hora: string

  @column()
  declare planta: string

  @column()
  declare departamento: string

  @column({ columnName: 'no_empleado' })
  declare noEmpleado: string

  @column()
  declare nombre: string

  @column()
  declare puesto: string

  @column()
  declare reporta: string

  @column()
  declare motivo: string

  @column()
  declare year: number

  @column()
  declare ts: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}