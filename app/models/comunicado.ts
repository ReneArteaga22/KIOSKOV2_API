import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Comunicado extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare imagen: string

  @column()
  declare nombre: string

  @column()
  declare fecha: string
}