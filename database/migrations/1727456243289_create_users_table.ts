import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('nombre',255).notNullable()
      table.string('apellidos',255).notNullable()
      table.string('usuario',255).notNullable().unique()
      table.string('contrasena',255).notNullable()
      table.boolean('estado').notNullable().defaultTo(true)
      table.string('firma',255).notNullable()
      table.string('correo',255).notNullable().unique()
      table.string('telefono',255).notNullable()
      table.string('foto',255).notNullable()
      table.integer('id_rol').unsigned().references('id').inTable('roles').defaultTo(4)
      table.datetime('created_at').notNullable()
      table.datetime('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}