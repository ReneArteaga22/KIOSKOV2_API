import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Comunicado extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare imagen: string

  @column()
  declare nombre: string

  @column()
  declare fecha: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}