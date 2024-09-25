import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Comedore extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare comedor: string

  @column()
  declare planta_id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

//caseta, modulo de asistencia