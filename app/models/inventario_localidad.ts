import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class InventarioLocalidad extends BaseModel {
  public static table = 'inventario_localidades'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare localidadNombre: string

  @column()
  declare estatus: 'CONTEO' | 'CAPTURA' | 'VALIDACION' | 'FINALIZADO'

  @column()
  declare dineroTotal: number

  @column()
  declare dineroEncontrado: number

  @column()
  declare dineroAjuste: number

  @column()
  declare categoria: string

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare ultimaActualizacion: DateTime

  // Relación: Una localidad pertenece a un usuario (equipo)
  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  // Computed property para calcular porcentaje basado en estatus
  get porcentajeEstatus(): number {
    switch (this.estatus) {
      case 'CONTEO':
        return 25
      case 'CAPTURA':
        return 50
      case 'VALIDACION':
        return 75
      case 'FINALIZADO':
        return 100
      default:
        return 0
    }
  }
}