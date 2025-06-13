import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Avance from './avance.js'
import Observacion from './observacion.js'

export default class Equipo extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column()
  declare planta: 'Planta 1' | 'Planta 2'

  @hasMany(() => Avance)
  declare avances: HasMany<typeof Avance>

  @hasMany(() => Observacion)
  declare observaciones: HasMany<typeof Observacion>
}