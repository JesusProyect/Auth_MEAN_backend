const { response, request } = require('express');
const Usuario = require( '../models/Usuario' );
const bcrypt = require( 'bcryptjs' );
const { generarJWT } = require( '../helpers/jwt' )

const crearUsuario = async ( req, res = response ) => {
  
    const { email, name, password } = req.body;

    try{
        // Verificar si no existe un correo igual
        const usuario = await Usuario.findOne({ email });
        if( usuario ){
            return res.status( 400 ).json({
                ok: false,
                msg: 'Email ya Existe'
            });
        }
         // Crear usuario con el modelo
         const dbUser = new Usuario( req.body );

         // Encriptar la contraseña
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync( password, salt );

         // Generar el JWT como metodo de autenticacion pasiva
    
        const token = await generarJWT( dbUser.id, name );
      
         // Crear usuario de base de datos
         await dbUser.save();

         // Generar Respuesta exitosa
         return res.status( 201 ).json({
            ok: true,
            uid: dbUser.id,
            name,
            token
        });

    }catch ( error ) {
        console.log( error );
        return res.status( 500 ).json({
            ok:false,
            msg:'Por favor hable con el administrador'
        });
    }

 
}

const loginUsuario = async ( req, res = response ) => {
 
    const { email, password } = req.body;

    try{
    // verificar si existe el email
        const dbUser = await Usuario.findOne( { email } );
        if( !dbUser ){
            return res.status( 400 ).json({
                ok: false,
                msg: 'El email no existe'
            });
        } 

    // confirmar si la clave hace math
    const validPassword = bcrypt.compareSync( password, dbUser.password );
    if( !validPassword ){
        return res.status( 400 ).json({
            ok: false,
            msg: 'El password no es valido'
        });
    }

    // generar JWT
    const token = await generarJWT( dbUser.id, dbUser.name );

    //respuesta exitosa
    return res.json({
        ok: true,
        uid: dbUser.id,
        name: dbUser.name,
        token
    })


    }catch( err ){
        console.log( err);
        return res.status( 500 ).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

    return res.json({
        ok:true,
        msg:'Login de usuario / new'
    });
}

const revalidarToken = async ( req, res = response ) => {

    const { uid, name } = req; 

     // generar JWT
     const token = await generarJWT( uid, name );
   
    return res.json({
        ok:true,
        uid,
        name,
        token
    });
}

module.exports = { 
    crearUsuario,
    loginUsuario,
    revalidarToken
 }