import ReporteSeguridad from '#models/reporte_seguridad'
import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'

export default class ReporteSeguridadsController {

    async reportes_seguridad({response}:HttpContext){
        const reportes = await ReporteSeguridad.all()

        return response.status(200).json({
            titulo:'exito',
            reportes:reportes
        })
    }

    async crear_reporte({request, response}:HttpContext){
        const {nombre, num_empleado, categoria, descripcion} = request.body()
        const reporte = new ReporteSeguridad()

        reporte.nombre = nombre
        reporte.num_empleado = num_empleado
        reporte.categoria = categoria
        reporte.descripcion = descripcion

        await reporte.save()
        
        let destinatario:string

        if (categoria === 'Nominas'){
            destinatario = 'carlo.sanches@clayens.com'
        }else if(categoria === 'Gafete'){
            destinatario = 'raul.reyes@clayens.com'
        }else if(categoria === 'Retiro Ahorro'){
            destinatario = "default@example.com"
        }else if(categoria === 'Consulta Vacaciones'){
            destinatario = 'default@gmail.com'
        }

        const email = 'kioskoclayens@gmail.com'

        await mail.send((message)=>{
            message
            // .to(destinatario) descomentar esto cuando tengas los correos de cada modulo RH
            .to('cabellordz15@gmail.com')
            .from(email)
            .subject('kiosko')
        })

        return response.status(200).json({
            titulo:'Exito',
            mensaje:'Se creo el reporte',
            reporte:reporte
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