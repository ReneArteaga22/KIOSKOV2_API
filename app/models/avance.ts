import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Equipo from './equipo.js'
import User from './user.js'

export default class Avance extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare porcentajeAvance: number

  @column.date()
  declare fecha: DateTime

  @column ()
  declare hora: string


  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}