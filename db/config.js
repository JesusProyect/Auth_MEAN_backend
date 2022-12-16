const mongoose  = require("mongoose");


const dbConnection = async () => {
    try{

        mongoose.set('strictQuery', true);
        
        await mongoose.connect (process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log( ' DB Online ')
    
    }catch ( error ){
        console.log( error );
        throw new Error( 'Error a la hora de inicializar la base de datos' )
    }
}

module.exports = {
    dbConnection
}