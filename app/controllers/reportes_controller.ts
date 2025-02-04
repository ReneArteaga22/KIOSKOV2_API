import Reporte from '#models/reporte'
import type { HttpContext } from '@adonisjs/core/http'

export default class ReportesController {
    
    async reportes({response}:HttpContext){
        try {
            const resportes = await Reporte.query()
            .whereNot('estatus','resuelto')
            .orderBy('fecha', 'desc')
            return response.status(200).json({
                titulo:'Exito',
                mensaje:'Lista de reportes',
                reportes: resportes
            })
        } catch (error) {
            return response.status(200).json({
                titulo:'Error',
                mensaje:'Algo sucedio al procesar la solicitud :/',
                error:error.message
            })
        }
    }

    async reporte_x_id({response, request}:HttpContext){
        try {
            const{id} = request.body()
            const reporte = await Reporte.query()
            .where('id',id)
            .firstOrFail()

            return response.status(200).json({
                titulo:'Exito',
                mensaje:'Reporte obtenido',
                reporte:reporte
            })
        } catch (error) {
            return response.status(400).json({
                titulo:'Error',
                error:error.message
            })
        }
    }

    async filtrar_reportes({response, request}:HttpContext){
        const{categoria, estatus, planta} = request.body()
        let query = Reporte.query()
        

        if(categoria){
            query = query.where('categoria',categoria)
        }
        if(estatus){
            query = query.where('estatus',estatus)
        }
        if(planta){
            query = query.where('planta',planta)
        }

        const filtro = await query

        if(!filtro || filtro.length === 0){
            return response.status(404).json({
                titulo:'Error',
                mensaje:'No existen reportes :/'
            })
        }

        return response.status(200).json({
            titulo:'Exito',
            reportes:filtro
        })
    }

    async actualizar_estado_reporte({response, request}: HttpContext) {
        try {
            const { id, estatus } = request.body();
    
            const reporte = await Reporte.query().where('id', id).firstOrFail();
    
            reporte.estatus = estatus;
    
            await reporte.save();
    
            return response.status(200).json({
                titulo: 'Éxito',
                mensaje: 'Estado actualizado',
                reporte: reporte
            });
        } catch (error) {
            return response.status(400).json({
                titulo: 'Error',
                error: error.message
            });
        }
    }    
}