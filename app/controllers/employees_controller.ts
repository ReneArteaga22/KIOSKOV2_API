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

    async gerencia({response}:HttpContext){

        const gerencia = await Employee.query().where('nombres','ANTONI')
        // const{puesto} = request.body()
        // let query = Employee.query()

        // if(puesto){
        //     query = query.where('Gerencia',puesto)
        // }


        return response.status(200).json({
            titulo:'Exito',
            reportes:gerencia
        })
    }
}