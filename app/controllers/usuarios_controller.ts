import type { HttpContext } from '@adonisjs/core/http'
import Usuario from '#models/usuario'
import hash from '@adonisjs/core/services/hash'

export default class UsuariosController {
    async index ({response}:HttpContext){
        const Users = await Usuario.all()
        return response.status(200).json({
            title: 'Success',
            usuarios: Users
        })
    }

    async register({request, response}:HttpContext){

        const{nombre, apellidos, usuario, contrasena, area, estatus, puesto, firma, correo, telefono, foto} = request.body()
        const contrasenaHash = await hash.make(contrasena)
        const nuevoUsuario = new Usuario
        nuevoUsuario.nombre = nombre
        nuevoUsuario.apellidos = apellidos
        nuevoUsuario.usuario = usuario
        nuevoUsuario.contrasena = contrasenaHash
        nuevoUsuario.area = area
        nuevoUsuario.estatus= estatus
        nuevoUsuario.puesto = puesto
        nuevoUsuario.firma = firma
        nuevoUsuario.correo = correo
        nuevoUsuario.telefono = telefono
        nuevoUsuario.foto = foto

        nuevoUsuario.save()

        return response.status(200).json({
        titulo: 'Exito',
        mensaje: 'Usuario registrado con exito',
        usuario: nuevoUsuario
        })
    }

    async login({request, response}:HttpContext){
        const {correo, contrasena} = request.only(['correo','contrasena'])
        const usuario = await Usuario.query()
        .where('correo',correo)
        .orWhere('usuario', correo)
        .first()

        //Validacion en caso de que le usuario no exista o no este registrado 
        if(!usuario){
            return response.status(404).json({
                titulo: 'Error',
                mensaje:'Usuario no encontrado'
            })
        } 

        //validacion si la contraseña guardada es la misma que el usuario esta ingresando 
        if (await hash.verify(usuario.contrasena, contrasena)) {
            return response.status(200).json({
                titulo:'exito',
                mensaje:'Inicio de sesion exitoso',
                rol:usuario.area
            })
        }
        //en caso de error en alguno de los campos manda a la excepcion 
        else{
            return response.status(400).json({
                titulo:'Error',
                mensaje:'Contraseña o usuario incorrectos'
            })
        }
    }


    async recuperar_contrasena({request, response}:HttpContext){
        const {correo, nuevaContrasena} = request.body()
        const usuario = await Usuario.findByOrFail('correo',correo)
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
        
        let query = Usuario.query();
    
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