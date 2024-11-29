import router from "@adonisjs/core/services/router";
import ReporteSeguridadsController from "#controllers/reporte_seguridad_controller";

router.group(()=>{
    router.post('/crear_reporte',[ReporteSeguridadsController,'crear_reporte'])
}).prefix('/api/reporte_seguridad')