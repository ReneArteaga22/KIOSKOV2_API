import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import InvLista from './inv_lista.js'
import type { EstadoLista } from '#services/inventario/constantes'

export default class InvListaTransicion extends BaseModel {
  static table = 'inv_lista_transicion'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare listaId: number

  @column()
  declare estadoAnterior: EstadoLista | null

  @column()
  declare estadoNuevo: EstadoLista

  @column.dateTime()
  declare fecha: DateTime

  @column()
  declare usuarioId: number

  @column()
  declare comentario: string | null

  @belongsTo(() => InvLista, { foreignKey: 'listaId' })
  declare lista: BelongsTo<typeof InvLista>
}
