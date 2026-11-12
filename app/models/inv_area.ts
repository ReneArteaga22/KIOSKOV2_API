import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import InvLocalidad from './inv_localidad.js'

export default class InvArea extends BaseModel {
  static table = 'inv_area'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare codigo: string

  @column()
  declare nombre: string

  @hasMany(() => InvLocalidad, { foreignKey: 'areaId' })
  declare localidades: HasMany<typeof InvLocalidad>
}
