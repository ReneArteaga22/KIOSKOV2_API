// import { DateTime } from 'luxon'
import Hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
// import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import InventarioLocalidad from './inventario_localidad.js'
import Avance from './avance.js'
// import { belongsTo } from '@adonisjs/lucid/orm' --- IGNORE ---
// import User from './user.js' --- IGNORE ---
const AuthFinder = withAuthFinder(() => Hash.use('scrypt'), {
  uids: ['usuario','correo'],
  passwordColumnName: 'contrasena',
})

export default class User extends compose(BaseModel, AuthFinder) {
  public static table = 'users'

  @column({ isPrimary: true })
  declare id: number
  @column()
  declare nombre:string
  @column()
  declare apellidos:string
  @column()
  declare usuario:string
  @column({ serializeAs: null })
  declare contrasena: string
  @column()
  declare area:string 
  @column()
  declare estatus:string  
  @column()
  declare puesto:string
  @column()
  declare firma:string
  @column()
  declare correo:string
  @column()
  declare telefono:number
  @column()
  declare foto:string
  @column()
  declare miembros: { nombre_completo: string; puesto: string }[] | null
  
  @hasMany(() => InventarioLocalidad, {
    foreignKey: 'userId',
  })
  declare localidades: HasMany<typeof InventarioLocalidad>

  @hasMany(() => Avance, {
    foreignKey: 'userId',
  })
  declare avances: HasMany<typeof Avance>

  // @column()
  // declare id_planta:number
  // @column()
  // declare id_rol:number

  // @belongsTo(() => User)
  // declare user: BelongsTo<typeof User>

  // @column.dateTime({ autoCreate: true })
  // declare createdAt: DateTime

  // @column.dateTime({ autoCreate: true, autoUpdate: true })
  // declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)
}