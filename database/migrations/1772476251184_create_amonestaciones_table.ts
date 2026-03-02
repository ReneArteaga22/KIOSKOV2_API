import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Amonestaciones extends BaseSchema {
  protected tableName = 'amonestaciones'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.date('fecha').notNullable()
      table.string('hora', 5).notNullable()
      table.string('planta', 50).notNullable()
      table.string('departamento', 80).notNullable()
      table.string('no_empleado', 20).notNullable()
      table.string('nombre', 150).notNullable()
      table.string('puesto', 100).notNullable()
      table.string('reporta', 150).notNullable()
      table.text('motivo').notNullable()
      table.integer('year').unsigned().notNullable()
      table.bigInteger('ts').notNullable()
      table.timestamps(true, true)
    })

    // Índices para filtros y semáforo
    this.schema.alterTable(this.tableName, (table) => {
      table.index(['year'], 'idx_year')
      table.index(['no_empleado', 'year'], 'idx_emp_year')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}