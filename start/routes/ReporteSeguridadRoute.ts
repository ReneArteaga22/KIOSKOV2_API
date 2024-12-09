import router from "@adonisjs/core/services/router";
import ReporteSeguridadsController from "#controllers/reporte_seguridad_controller";

router.group(()=>{
    router.get('/reportes',[ReporteSeguridadsController,'reportes_seguridad'])
    router.post('/crear_reporte',[ReporteSeguridadsController,'crear_reporte'])
    router.post('/filtrar_reporte_seguridad',[ReporteSeguridadsController,'filtrar_reporte_seguridad'])
}).prefix('/api/reporte_seguridad')