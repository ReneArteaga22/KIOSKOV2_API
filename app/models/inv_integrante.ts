import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import InvEquipo from './inv_equipo.js'
import type { RolIntegrante } from '#services/inventario/constantes'

export default class InvIntegrante extends BaseModel {
  static table = 'inv_integrante'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare equipoId: number

  @column()
  declare nombreCompleto: string

  @column()
  declare rol: RolIntegrante

  @belongsTo(() => InvEquipo, { foreignKey: 'equipoId' })
  declare equipo: BelongsTo<typeof InvEquipo>
}
