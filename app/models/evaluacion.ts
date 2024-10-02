import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Evaluacion extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  
  @column()
  declare calificacion:string
  @column()
  declare comentario:string
  @column()
  declare id_servicio:number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}