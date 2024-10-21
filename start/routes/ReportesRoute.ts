import ReportesController from "#controllers/reportes_controller";
import router from "@adonisjs/core/services/router";

router.group(()=>{
    router.get('/reportes',[ReportesController,'reportes'])
    router.post('/crear-reporte',[ReportesController,'crear_reporte'])
}).prefix('/api/reporte')