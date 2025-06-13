import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
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

  @belongsTo(() => Equipo)
  declare equipo: BelongsTo<typeof Equipo>
}