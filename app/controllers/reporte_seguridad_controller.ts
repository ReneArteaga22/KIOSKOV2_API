import ReporteSeguridad from '#models/reporte_seguridad'
import type { HttpContext } from '@adonisjs/core/http'

export default class ReporteSeguridadsController {

    async reportes_seguridad({response}:HttpContext){
        const reportes = await ReporteSeguridad.all()

        return response.status(200).json({
            titulo:'exito',
            reportes:reportes
        })
    }

    async filtrar_reporte_seguridad ({request, response}:HttpContext){
        const{categoria, fechas} = request.body()
        let query = ReporteSeguridad.query()

        if(categoria){
            query = query.where('categoria',categoria)
        }

        if (fechas && fechas.length === 2) {
            const [startDate, endDate] = fechas;
            const endDateAdjusted = new Date(endDate);
            endDateAdjusted.setHours(23, 59, 59, 999); 
            console.log('Filtrando por fechas:', { startDate, endDateAdjusted }); 
            query = query.whereBetween('createdAt', [startDate, endDateAdjusted]);
        }

        const filtro = await query

        return response.status(200).json({
            titulo:'Exito',
            reportes:filtro
        })
    }
}