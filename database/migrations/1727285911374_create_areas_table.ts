import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'areas'

  //CREACION DE LA TABLA AREAS, ACEPTA CAMPOS NULOS
  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('area',255).nullable()
      table.string('imagen',255).nullable()
      table.datetime('created_at')
      table.datetime('updated_at')
    })
  }
  async down() {
    this.schema.dropTable(this.tableName)
  }
}