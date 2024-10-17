import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Reporte extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare folio: string

  @column()
  declare categoria: string

  @column()
  declare no_empleado: string
  
  @column()
  declare grupo:string

  @column()
  declare nombre: string

  @column()
  declare descripcion: string

  @column()
  declare planta:string

  @column()
  declare estatus:string

  @column()
  declare telefono:string

  @column() 
  declare fecha:string

  // @column.dateTime({ autoCreate: true })
  // declare createdAt: DateTime

  // @column.dateTime({ autoCreate: true, autoUpdate: true })
  // declare updatedAt: DateTime
}