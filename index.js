const express = require( 'express' ); // esto es como un import de TS
const cors = require( 'cors' );
const path = require( 'path' )
const { dbConnection } = require('./db/config');
require( 'dotenv' ).config();

//console.log( process.env); // variabels de entorno por defecto de express

// Crear el servidor / aplicaion de express
const app = express();

// Base de datos
dbConnection();

// Directorio Publico
app.use( express.static( 'public' ) );

// CORS
app.use( cors() );

// Lectura y parseo del body en las request
app.use( express.json() );

//Rutas
app.use( '/api/auth', require( './routes/auth' ) );
 
//Manejar demas rutas
app.get( '*' , ( req, res ) => {
    res.sendFile( path.resolve( __dirname, 'public/index.html' ))
});




// levantar app en el puerto
app.listen( process.env.PORT, () => {
    console.log( `servidor corriendo en puerto ${ process.env.PORT }` )
} );
