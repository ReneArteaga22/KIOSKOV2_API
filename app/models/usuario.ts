// import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { BaseModel,beforeSave,column } from '@adonisjs/lucid/orm'

export default class Usuario extends BaseModel {
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
  // @column.dateTime({ autoCreate: true })
  // declare createdAt: DateTime
  // @column.dateTime({ autoCreate: true, autoUpdate: true })
  // declare updatedAt: DateTime
  @beforeSave()
  static async hashPassword(user: Usuario) {
    if (user.$dirty.constrasena) {
      user.contrasena = await hash.make(user.contrasena)
    }
  }
}