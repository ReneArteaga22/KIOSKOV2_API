import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ReporteSeguridad extends BaseModel {

   public static table = 'reporte_seguridad'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre:string

  @column()
  declare num_empleado:number

  @column()
  declare categoria:string

  @column()
  declare descripcion:string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}