import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'evaluaciones'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('calificacion',255).notNullable()
      table.string('comentario',255).nullable()
      table.string('planta',255).notNullable()
      table.string('servicio',255).notNullable()
      table.datetime('created_at').notNullable()
      table.datetime('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}