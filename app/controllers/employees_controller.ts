import type { HttpContext } from '@adonisjs/core/http'
import Employee from '#models/employee'

export default class EmployeesController {
    public async index({ response }: HttpContext) {
        try {
            const employee = await Employee.all()
            return response.json(employee)
        } catch (error) {
            return response.status(500).json({message:'Error en la consulta', error})
        }
    }
}