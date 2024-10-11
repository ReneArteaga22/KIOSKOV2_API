import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Evaluacion extends BaseModel {
  public static table = 'evaluaciones'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare calificacion:string

  @column()
  declare comentario:string

  @column()
  declare planta:string

  @column()
  declare servicio:string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}