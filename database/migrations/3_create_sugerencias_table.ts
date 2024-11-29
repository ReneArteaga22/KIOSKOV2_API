import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sugerencias'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('sugerencia',255).notNullable()
      table.datetime('created_at')
      table.datetime('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}