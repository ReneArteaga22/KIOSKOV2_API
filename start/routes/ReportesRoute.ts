import ReportesController from "#controllers/reportes_controller";
import router from "@adonisjs/core/services/router";

router.group(()=>{
    router.get('/reportes',[ReportesController,'reportes'])
    router.post('/crear-reporte',[ReportesController,'crear_reporte'])
    router.post('/reporte_x_id',[ReportesController,'reporte_x_id'])
    router.post('/filtrar_reporte',[ReportesController,'filtrar_reportes'])
    router.post('/actualizar_estado',[ReportesController,'actualizar_estado_reporte'])
}).prefix('/api/reporte')