import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reporte_seguridad'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nombre',255).nullable()
      table.integer('num_empleado').nullable()
      table.string('categoria',255).notNullable()
      table.string('descripcion',255).notNullable()
      table.datetime('created_at')
      table.datetime('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}