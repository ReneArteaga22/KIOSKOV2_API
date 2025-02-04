import router from '@adonisjs/core/services/router'
import SendEmailsController from '#controllers/send_emails_controller'

router.group(()=>{
    router.get('/send_mail',[SendEmailsController,'send_email'])
    router.post('/reporte_acoso_y_acto_inseguro',[SendEmailsController,'reporte_acoso_y_acto_inseguro'])
    router.post('/reporte_soporte_recursos_humanos',[SendEmailsController,'reporte_soporte_recursos_humanos'])
}).prefix('/api/email')