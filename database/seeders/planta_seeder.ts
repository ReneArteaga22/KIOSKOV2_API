import Planta from '#models/planta'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Planta.createMany([
      {planta:'planta uno'},
      {planta:'planta dos'}
    ])
    // Write your database queries inside the run method
  }
}