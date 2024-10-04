import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class UsuariosController {


    async index({response}:HttpContext){
        const usuarios = await User.all()
        response.status(200).json({
            titulo:'Exito',
            mensaje:'Lista de usuarios',
            usuaris:usuarios
            
        })
    }

    async register({request, response}:HttpContext){
        const {nombre, apellidos, usuario, contrasena, firma, correo, telefono, foto, id_planta} = request.body()

        const nuevoUsuario = new User
        nuevoUsuario.nombre = nombre
        nuevoUsuario.apellidos = apellidos
        nuevoUsuario.usuario = usuario
        nuevoUsuario.contrasena = contrasena
        nuevoUsuario.firma = firma
        nuevoUsuario.correo = correo
        nuevoUsuario.telefono = telefono
        nuevoUsuario.foto = foto
        nuevoUsuario.id_planta = id_planta

        nuevoUsuario.save()

        console.log(contrasena)
        return response.status(200).json({
            titulo:'Exito',
            mensaje:'Usuario registrado'
        })
    }

    async login({request, response}:HttpContext){
        const {uids, contrasena} = request.only(['uids','contrasena'])
        const usuario = await User.query()
        .where('correo',uids)
        .orWhere('usuario', uids)
        .firstOrFail()

        if (await hash.verify(usuario.contrasena, contrasena)) {
            const token = await User.accessTokens.create(usuario)
            return response.status(200).json({
                titulo:'exito',
                mensaje:'Inicio de sesion exitoso',
                token:token
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
        const {correo, nuevaContrasena} = request.body()
        const usuario = await User.findByOrFail('correo',correo)
        const contrasenaNuevaHash = await hash.make(nuevaContrasena)

        //compararcion de correo que el usuario esta ingresando y correo guardado en nuestra base de datos, si es true entra y guarda la nueva contraseña 
        if(usuario.correo === correo){
            usuario.contrasena = contrasenaNuevaHash
            await usuario.save()

            return response.status(200).json({
                titulo:'Exito!',
                mensaje:'Contraseña recuperada con exito'
            })
            // si es false la condicion manda un error 400 de usuario incorrecto 
        }else{
            return response.status(400).json({
                titulo:'Error',
                mensaje:'Correo incorrectos'
            })
        }
    }

    async buscar_usuario({ response, request }: HttpContext) {
        const { nombre, area } = request.body()
        
        let query = User.query();
    
        if (nombre) {
            query = query.where('nombre', 'like', `%${nombre}%`)
            .orWhere('apellidos', 'like', `%${nombre}%`);
        }
    
        if (area) {
            query = query.where('area', 'like', `%${area}%`);
        }
    
        const usuarios = await query;

        if (usuarios.length === 0) {
            return response.status(404).json({
                titulo: 'No encontrado',
                mensaje: 'No se encontraron usuarios con los criterios proporcionados',
            });
        }

        return response.status(200).json({
            titulo: 'Éxito',
            mensaje: 'Usuarios encontrados',
            usuarios: usuarios,
        });
    }
}
