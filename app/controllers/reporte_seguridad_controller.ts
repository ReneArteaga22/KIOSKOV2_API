import ReporteSeguridad from '#models/reporte_seguridad'
import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'

export default class ReporteSeguridadsController {

    async crear_reporte({request, response}:HttpContext){
        const {nombre, num_empleado, categoria, descripcion} = request.body()
        const reporte = new ReporteSeguridad()

        reporte.nombre = nombre
        reporte.num_empleado = num_empleado
        reporte.categoria = categoria
        reporte.descripcion = descripcion

        await reporte.save()

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
}