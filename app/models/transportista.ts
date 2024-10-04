import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Transportista extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre_chofer:string

  @column()
  declare empresa:string

  @column()
  declare destino:string

  @column()
  declare vehiculo:string

  @column()
  declare placas:string

  @column()
  declare estatus:string

  @column()
  declare fecha_llegada:DateTime

  @column()
  declare hora_llegada:DateTime

  @column()
  declare fecha_entrada:DateTime

  @column()
  declare hora_entradda:DateTime

  @column()
  declare fecha_salida:DateTime

  @column()
  declare hora_salida:DateTime

  @column()
  declare planta:number

  @column()
  declare razon_cancel:string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}