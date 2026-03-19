import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Empleado extends BaseModel {
  public static connection  = 'asistencia'
  public static table       = 'empleados'
  public static primaryKey  = 'Numero'

  @column({ isPrimary: true, columnName: 'Numero' })
  declare Numero: number

  @column({ columnName: 'FirstName' })
  declare FirstName: string

  @column({ columnName: 'MiddleName' })
  declare MiddleName: string

  @column({ columnName: 'Surname' })
  declare Surname: string | null

  @column({ columnName: 'NSS' })
  declare NSS: string | null

  @column({ columnName: 'BirthDay' })
  declare BirthDay: string | null

  @column({ columnName: 'Department' })
  declare Department: string

  @column({ columnName: 'Plant' })
  declare Plant: 'UP1' | 'UP2' | null

  @column({ columnName: 'JobTitleSpanish' })
  declare JobTitleSpanish: string

  @column({ columnName: 'matx3' })
  declare matx3: string | null

  @column({ columnName: 'Activo' })
  declare Activo: 'SI' | 'NO' | null

  @column({ columnName: 'HiringDate' })
  declare HiringDate: string | null

  @column({ columnName: 'Baja' })
  declare Baja: string | null

  @column({ columnName: 'Shift' })
  declare Shift: string | null

  @column.dateTime({ columnName: 'created_at' })
  declare created_at: DateTime | null

  @column.dateTime({ columnName: 'updated_at' })
  declare updated_at: DateTime | null
}