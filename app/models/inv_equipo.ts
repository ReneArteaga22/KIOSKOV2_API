import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import InvIntegrante from './inv_integrante.js'
import InvLocalidad from './inv_localidad.js'
import InvLista from './inv_lista.js'

export default class InvEquipo extends BaseModel {
  static table = 'inv_equipo'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column({ consume: (v) => Boolean(v) })
  declare activo: boolean

  @hasMany(() => InvIntegrante, { foreignKey: 'equipoId' })
  declare integrantes: HasMany<typeof InvIntegrante>

  /** Localidades asignadas antes del inventario (plan original). */
  @hasMany(() => InvLocalidad, { foreignKey: 'equipoPlaneadoId' })
  declare localidadesPlaneadas: HasMany<typeof InvLocalidad>

  /** Listas que el equipo tiene actualmente. */
  @hasMany(() => InvLista, { foreignKey: 'equipoActualId' })
  declare listasActuales: HasMany<typeof InvLista>
}
