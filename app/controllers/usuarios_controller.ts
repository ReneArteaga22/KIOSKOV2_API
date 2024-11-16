import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
// import mail from '@adonisjs/mail/services/main'

export default class UsuariosController {


    async index({response}:HttpContext){
        try {
            const usuarios = await User.query()
            .orderBy('id', 'desc')
            .whereNotIn('nombre', ['comedor', 'Almacen', 'Caseta1', 'Caseta2']);

            return response.status(200).json({
                titulo:'Exito',
                mensaje:'Lista de usuarios',
                usuarios:usuarios
                
            })
        } catch (error) {
            return response.status(400).json({
                titulo:'ojo',
                error:error.message
            })
        }

    }

    async register({request, response}:HttpContext){
        try {
            const {nombre, apellidos, usuario, contrasena, area, estatus, puesto, firma, correo, telefono, foto } = request.body()

            const nuevoUsuario = new User
            nuevoUsuario.nombre = nombre
            nuevoUsuario.apellidos = apellidos
            nuevoUsuario.usuario = usuario
            nuevoUsuario.contrasena = contrasena
            nuevoUsuario.area = area
            nuevoUsuario.estatus = estatus
            nuevoUsuario.puesto = puesto
            nuevoUsuario.firma = firma
            nuevoUsuario.correo = correo
            nuevoUsuario.telefono = telefono
            nuevoUsuario.foto = foto
            // nuevoUsuario.id_planta = id_planta
    
            nuevoUsuario.save()
    
            return response.status(200).json({
                titulo:'Exito',
                mensaje:'Usuario registrado'
            })
        } catch (error) {
            return response.status(200).json({
                titulo:'Error',
                mensaje:'Ocurrio un error al registrar usuario'
            })
        }

    }

    async login({request, response}:HttpContext){
        const {uids, contrasena} = request.only(['uids','contrasena'])
        const usuario = await User.query()
        .where('correo',uids)
        .orWhere('usuario', uids)
        .firstOrFail()

        if (await hash.verify(usuario.contrasena, contrasena)) {
            // const token = await User.accessTokens.create(usuario)
            return response.status(200).json({
                titulo:'exito',
                mensaje:'Inicio de sesion exitoso',
                usuario:usuario
                // token:token
            })
        }
        else{
            return response.status(400).json({                
                titulo:'Error',
                mensaje:'Contraseña o usuario incorrectos'
            })
        }
    }

    async recuperar_contrasena({request, response}:HttpContext){
        const {contrasena, id} = request.only(['id','contrasena'])
        const user = await User.findByOrFail('id',id)

        if(!user){
            return response.status(404).json({
                titulo:'Error',
                mensaje:'Usuario no existe'
            })
        }

        user.contrasena = contrasena
        await user.save()
        return response.status(200).json({
            titulo:'Exito!',
            mensaje:'Contraseña recuperada con exito',
            con:contrasena
        })
    }

    async buscar_usuario({ response, request }: HttpContext) {
        const { nombre, area } = request.body()

        let query = User.query().orderBy('id', 'desc');

        if(nombre){
            query = query.where('nombre','like',`%${nombre}%`)
        }
        if(area){
            query = query.where('area',area)
        }

        const filtro = await query

        return response.status(200).json({
            filtro:filtro
        })
    }

    async usuario_x_id({request, response}:HttpContext){
        try {
            const {id} = request.body()
    
            if (!id) {
                return response.status(400).json({
                    titulo: 'Error',
                    mensaje: 'ID no proporcionado'
                })
            }
    
            const user = await User.query()
                .where('id', id)
                .firstOrFail()
    
            return response.status(200).json({
                titulo: 'Éxito',
                mensaje: 'Usuario encontrado',
                usuario: user
            })
    
        } catch (error) {
            // Captura el error si el usuario no es encontrado
            return response.status(404).json({
                titulo: 'Error',
                mensaje: 'Usuario no encontrado'
            })
        }
    }

    async editar_usuario({params, request, response }: HttpContext) {
        try {
            const{id} = params
            const userEdit = await User.find(id)

            if(!userEdit){
                return response.status(404).json({ 
                    titulo: 'Error', 
                    mensaje: 'Usuario no encontrado :(' 
                });
            }

            const {estatus, area, puesto, nombre, apellidos, usuario, correo, telefono} = request.only(['estatus','area','puesto','nombre','apellidos','usuario','correo','telefono'])

            userEdit.estatus = estatus || userEdit.estatus
            userEdit.area = area || userEdit.area
            userEdit.puesto = puesto || userEdit.puesto
            userEdit.nombre = nombre || userEdit.nombre
            userEdit.apellidos = apellidos || userEdit.apellidos
            userEdit.usuario = usuario || userEdit.usuario
            userEdit.correo = correo || userEdit.correo
            userEdit.telefono = telefono || userEdit.telefono
          
            await userEdit.save()
    
            return response.status(200).json({
                titulo: 'Función exitosa',
                usuario: userEdit
            })
        } catch (error) {
            return response.status(400).json({
                titulo: 'Error al actualizar el usuario',
                error: error.message
            })
        }
    }   


    async modificar_estado({params, request, response}:HttpContext){
        try {
            const {id} = params
            const estadoEdit = await User.find(id)

            if(!estadoEdit){
                return response.status(404).json({ 
                    titulo: 'Error', 
                    mensaje: 'Usuario no encontrado :(' 
                });
            }

            const{estatus}= request.only(['estatus'])

            estadoEdit.estatus = estatus

            await estadoEdit.save()

            return response.status(200).json({
                titulo: 'Función exitosa',
                usuario: estadoEdit
            })
        } catch (error) {
            return response.status(400).json({
                titulo: 'Error al actualizar el usuario',
                error: error.message
            })
        }
    }

    // async store({ response, request }: HttpContext) {
    //     try {
    //         const { correo } = request.only(['correo']);     

    //         await mail.send((message) => {
    //           message
    //             .to(correo)
    //             .subject('Clayens NP North.')
    //         })

    //         return response.status(200).json({
    //             titulo:'Exito',
    //             mensaje:`Correo enviado a este correo: ${correo}`
    //         })
    //     } catch (error) {
    //         return response.status(200).json({
    //             titulo:'Error',
    //             error:error.message
    //         })
    //     }
    // }
}
