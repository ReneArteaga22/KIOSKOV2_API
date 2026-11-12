import { DateTime } from 'luxon'
import { BaseModel, column, computed, belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import InvEquipo from './inv_equipo.js'
import InvLocalidad from './inv_localidad.js'
import InvListaAsignacion from './inv_lista_asignacion.js'
import InvListaTransicion from './inv_lista_transicion.js'
import type { EstadoLista } from '#services/inventario/constantes'

const decimal = { consume: (v: unknown) => Number(v ?? 0) }

export default class InvLista extends BaseModel {
  static table = 'inv_lista'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare folio: string

  @column()
  declare descripcion: string | null

  @column()
  declare estado: EstadoLista

  @column.dateTime()
  declare estadoDesde: DateTime

  @column()
  declare equipoActualId: number | null

  /** Sobrantes (>= 0). */
  @column(decimal)
  declare ajustePositivo: number

  /** Faltantes (<= 0). */
  @column(decimal)
  declare ajusteNegativo: number

  @column.dateTime()
  declare creadoEn: DateTime

  /** Calculado, no se guarda. */
  @computed()
  get ajusteNeto(): number {
    return Math.round((Number(this.ajustePositivo) + Number(this.ajusteNegativo)) * 100) / 100
  }

  @belongsTo(() => InvEquipo, { foreignKey: 'equipoActualId' })
  declare equipoActual: BelongsTo<typeof InvEquipo>

  @manyToMany(() => InvLocalidad, {
    pivotTable: 'inv_lista_localidad',
    pivotForeignKey: 'lista_id',
    pivotRelatedForeignKey: 'localidad_id',
    pivotColumns: ['es_principal'],
  })
  declare localidades: ManyToMany<typeof InvLocalidad>

  @hasMany(() => InvListaAsignacion, { foreignKey: 'listaId' })
  declare asignaciones: HasMany<typeof InvListaAsignacion>

  @hasMany(() => InvListaTransicion, { foreignKey: 'listaId' })
  declare transiciones: HasMany<typeof InvListaTransicion>
}
