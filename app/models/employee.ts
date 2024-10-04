
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Employee extends BaseModel {
  public static connection = 'sqlserver'

  public static table = 'dbo.empleado'

  @column({ isPrimary: true })
  declare conse: number

  @column()
  declare num_emp: number

  @column()
  declare nombres: string

  @column()
  declare direccion: string

  @column()
  declare telefono: string

  @column()
  declare puesto: string

  @column()
  declare ingreso: string // Cambiado a string debido a la definición de la base de datos

  @column()
  declare apellidos: string

  @column()
  declare grupo: string

  @column()
  declare fec_nac: string // Cambiado a string debido a la definición de la base de datos

  @column()
  declare num_empt: string

  @column()
  declare egreso: string // Cambiado a string debido a la definición de la base de datos

  @column()
  declare foto: string

  @column()
  declare nombrec: string

  @column()
  declare fec_alta: Date

  @column()
  declare mod_alta: string

  @column()
  declare usu_alta: number

  @column()
  declare fec_mod: Date

  @column()
  declare mod_mod: string

  @column()
  declare usu_mod: number

  @column()
  declare fec_baja: Date

  @column()
  declare mod_baja: string

  @column()
  declare usu_baja: number

  @column()
  declare salario: number // Decimal se puede representar como number

  @column()
  declare email: string

  @column()
  declare emergencia: string

  @column()
  declare idpuesto: number

  @column()
  declare estatus: string

  @column()
  declare nombrepila: string

  @column()
  declare nss: string

  @column()
  declare tiporh: string

  @column()
  declare padecimientos: string

  @column()
  declare alergias: string

  @column()
  declare apellidop: string

  @column()
  declare sexo: string

  @column()
  declare planta: string

  @column()
  declare matx3: string
}