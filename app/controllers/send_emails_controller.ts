import Reporte from '#models/reporte'
import ReporteSeguridad from '#models/reporte_seguridad'
import { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'

export default class SendEmailsController {
    async send_email({}:HttpContext){
        const email = 'kioskoclayens@gmail.com'
            
        await mail.send((message)=>{
            message
            .to('cabellordz15@gmail.com')
            .from(email)
            .subject('Reporte de Kiosko')
            .htmlView('emails/rh_email_html')
        })
    }

    async reporte_acoso_y_acto_inseguro({request, response}:HttpContext){
        const {nombre, num_empleado, categoria, descripcion} = request.body()
        const reporte = new ReporteSeguridad()

        reporte.nombre = nombre
        reporte.num_empleado = num_empleado
        reporte.categoria = categoria
        reporte.descripcion = descripcion

        await reporte.save()

        const destinatarios = ['cabellordz15@gmail.com',]
        const email = 'kioskoclayens@gmail.com'

        await mail.send((message)=>{
            destinatarios.forEach(destino =>{
                message.to(destino)
            })
            message
            .from(email)
            .subject('Reporte de Kiosko Clayens')
            .htmlView('emails/seguridad_email_html')
        })

        return response.status(200).json({
            titulo:'Exito!',
            mensaje:'Se creo el reporte',
            reporte:reporte
        })
    }

    async reporte_soporte_recursos_humanos({request, response}:HttpContext){
        const{categoria, no_empleado, grupo, nombre, descripcion, planta, telefono} = request.body()
        const reporte = new Reporte()
        const date = new Date()

        let folioPrefix
        if(planta === '1'){
            folioPrefix = '01'
        }else if(planta === '02'){
            folioPrefix = '02'
        }else{
            return response.status(400).json({
                titulo:'Error',
                mensaje:'Planta desconocida'
            })
        }

        const ultimoReporte = await Reporte.query()
        .where('planta',planta)
        .orderBy('fecha','desc')
        .first()

        let nuevoFolio
        if(ultimoReporte){
            const ultimoFolio = parseInt(ultimoReporte.folio.split('-')[1],10)
            nuevoFolio = `${folioPrefix}-${(ultimoFolio + 1).toString().padStart(3,'0')}`
        }else{
            nuevoFolio = `${folioPrefix}-100`
        }

        reporte.folio = nuevoFolio
        reporte.fecha = date.toISOString().split('T')[0]
        reporte.categoria = categoria
        reporte.no_empleado = no_empleado
        reporte.grupo = grupo
        reporte.nombre = nombre
        reporte.descripcion = descripcion
        reporte.planta = planta
        reporte.telefono = telefono
        
        await reporte.save()

        let destinatarios:string[]

        if(categoria === 'Nominas'){
            destinatarios = ['cabellordz15@gmail.com','cabellordz15@gmail.com']
        }else if(categoria === 'Gafete'){
            destinatarios = ['cabellordz15@gmail.com']
        }else if(categoria === 'Retiro Ahorro'){
            destinatarios = ['cabellordz15@gmail.com']
        }else if(categoria === 'Consulta Vacacioens'){
            destinatarios = ['cabellordz15@gmail.com']
        }

        const email = 'kioskoclayens@gmail.com'

        await mail.send((message)=>{
            destinatarios.forEach(destino =>{
                message.to(destino)
            })
            message
            .from(email)
            .subject('Reporte de Kiosko Clayens')
            .htmlView('emails/rh_email_html')
        })

        return response.status(200).json({
            titulo:'Exito!',
            mensaje:'Se envio el reporte',
            reporte:reporte
        })
    }
}