import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import InvLista from './inv_lista.js'
import InvEquipo from './inv_equipo.js'

export default class InvListaAsignacion extends BaseModel {
  static table = 'inv_lista_asignacion'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare listaId: number

  @column()
  declare equipoId: number

  @column.dateTime()
  declare inicio: DateTime

  /** null = asignación vigente. */
  @column.dateTime()
  declare fin: DateTime | null

  @column()
  declare motivo: string | null

  @column()
  declare usuarioId: number

  @belongsTo(() => InvLista, { foreignKey: 'listaId' })
  declare lista: BelongsTo<typeof InvLista>

  @belongsTo(() => InvEquipo, { foreignKey: 'equipoId' })
  declare equipo: BelongsTo<typeof InvEquipo>
}
