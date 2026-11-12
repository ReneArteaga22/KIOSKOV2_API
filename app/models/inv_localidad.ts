import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import InvArea from './inv_area.js'
import InvEquipo from './inv_equipo.js'
import InvLista from './inv_lista.js'

export default class InvLocalidad extends BaseModel {
  static table = 'inv_localidad'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare areaId: number

  @column()
  declare nombre: string

  @column()
  declare equipoPlaneadoId: number | null

  @belongsTo(() => InvArea, { foreignKey: 'areaId' })
  declare area: BelongsTo<typeof InvArea>

  @belongsTo(() => InvEquipo, { foreignKey: 'equipoPlaneadoId' })
  declare equipoPlaneado: BelongsTo<typeof InvEquipo>

  @manyToMany(() => InvLista, {
    pivotTable: 'inv_lista_localidad',
    pivotForeignKey: 'localidad_id',
    pivotRelatedForeignKey: 'lista_id',
    pivotColumns: ['es_principal'],
  })
  declare listas: ManyToMany<typeof InvLista>

  /** Expone es_principal cuando la localidad se carga desde una lista. */
  serializeExtras() {
    const v = this.$extras.pivot_es_principal
    return v === undefined ? {} : { esPrincipal: Boolean(v) }
  }
}
