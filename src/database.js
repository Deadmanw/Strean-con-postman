const {MongoClient}=require('mongodb');

let db;

MongoClient.connect('mongodb://localhost/tracksdb', {useUnifiedTopology: true},(err,cliente)=>{
if(err){
    console.log(err);
    process.exit(0);
}
db=cliente.db('tracksdb'); // instanciamos la base de datos
console.log('La base de datos esta conectada');
});

// la convertimos en una funcion
const getConnection=()=> {return db };

//exportamos la base de datos
module.exports = {
    getConnection
}