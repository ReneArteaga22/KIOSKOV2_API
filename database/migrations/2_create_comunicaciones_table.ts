import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'comunicaciones'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('imagen',255).notNullable()
      table.string('nombre',255).notNullable()
      table.string('tipo',255).notNullable()
      table.datetime('created_at')
      table.datetime('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}