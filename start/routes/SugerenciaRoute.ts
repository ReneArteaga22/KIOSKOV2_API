import router from '@adonisjs/core/services/router'
import SugerenciasController from '#controllers/sugerencias_controller'

router.group(()=>{
    router.get('/sugerencias',[SugerenciasController,'sugerencias'])
    router.post('/crear_sugerencia',[SugerenciasController,'crear_sugerencia'])
}).prefix('/api/sugerencia')