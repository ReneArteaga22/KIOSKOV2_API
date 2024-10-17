import Reporte from '#models/reporte'
import type { HttpContext } from '@adonisjs/core/http'

export default class ReportesController {
    async crear_reporte({request, response}:HttpContext){
        try {
            const{folio, categoria, no_empleado, grupo, nombre, descripcion, planta, telefono} = request.body()
            const reporte = new Reporte();
            const date = new Date(); // La fecha actual

            reporte.folio = folio
            reporte.fecha = date.toISOString().split('T')[0];          
            reporte.categoria = categoria
            reporte.no_empleado = no_empleado
            reporte.grupo = grupo 
            reporte.nombre = nombre
            reporte.descripcion = descripcion
            reporte.planta = planta
            reporte.telefono = telefono

            await reporte.save()

            return response.status(200).json({
                titulo: 'Exito',
                mensaje: 'Reporte enviado con exito',
                reporte:reporte
            })
            
        } catch (error) {
            return response.status(400).json({
                titulo:'Error',
                error:error.message
            })
            
        }
    }
}