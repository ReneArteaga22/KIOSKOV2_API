import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'usuarios'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nombre',255).notNullable()
      table.string('apellidos',255).notNullable()
      table.string('usuario',255).notNullable()
      table.string('contraseña',255).notNullable()
      table.string('area',255).notNullable()
      table.string('estado', 255).notNullable().defaultTo('activo')
      table.string('puesto',255).notNullable()
      table.string('firma',255).notNullable()
      table.string('correo',255).notNullable()
      table.string('telefono',255).notNullable()
      table.string('foto',255).notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}