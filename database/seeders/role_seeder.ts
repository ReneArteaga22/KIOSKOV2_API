import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'

export default class extends BaseSeeder {
  async run() {
    await Role.createMany([
      {nombre:'RH', slug:'rh'},
      {nombre:'Sistemas', slug:'sistemas'},
      {nombre:'Comedor', slug:'comedor'},
      {nombre:'Operario', slug:'operario'}
    ])
  }
}
