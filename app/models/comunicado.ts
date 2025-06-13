import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Equipo from './equipo.js'

export default class Avance extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare equipoId: number

  @column()
  declare porcentajeAvance: number

  @column.date()
  declare fecha: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Equipo)
  declare equipo: BelongsTo<typeof Equipo>
}
