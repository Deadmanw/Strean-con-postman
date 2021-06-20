const multer=require('multer');
const {getConnection}=require('../database')
const {ObjectID,GridFSBucket}=require('mongodb');// contenedor de grid fs
const {Readable}=require('stream');
//funcion para mostrar la cancion
const getTrack = (req,res)=>{

    let trackID;
    //validamos si la id es correcta
  try {
    trackID = new ObjectID(req.params.trackID);
  } catch (error) {
    return res.status(400).json({ message: "La ID es invalida" });
  }
   
  res.set("content-type", "audio/mp3");// que tipo de documento se envia 
  res.set("accept-ranges", "bytes");//el tamaño es en datos

  const db = getConnection(); //conexion base de datos
  //consultamos la base la de datos 
  let bucket = new GridFSBucket(db, {
    bucketName: 'tracks'
  });
  // obtenemos la id  del archivo
  let downloadStream = bucket.openDownloadStream(trackID);
  //los datos llegan
  downloadStream.on('data', chunk => {
    res.write(chunk);//devuelve los datos al cliente
  });
  //se reporta un error
  downloadStream.on('error', () => {
    res.sendStatus(404);
  });
  //finaliza el stream del archivo
  downloadStream.on('end', () => {
    res.end();
  });
}

//funcion para guardar la cancion
const guardarTrack=(req,res)=>{
    const storage = multer.memoryStorage();
    const guardar=multer({
        storage:storage,
        limits:{
            fields:1,//campos extras ademas del archivo, el nombre
            fieldSize:30000000,//tamaño maximo del archivo
            files:1,//cantidad de archivos que vamos a subir
            parts:2//archi mas nombre de la cancion
        }
    });
    guardar.single('track')(req,res,(err)=>{
        if(err){
            console.log(err);
            return res.status(404).json({message:err.message});
        }else if(!req.body.name){
            return res.status(404).json({message:'La cancion debe llevar un nombre'});
        }

    let trackName=req.body.name;
    
    const archivoleible=new Readable();
    archivoleible.push(req.file.buffer);//funcion para enviarle el archivo a la base de datos
    archivoleible.push(null);

    const db=getConnection();// conectamos con la base de datos
    const bucket = new GridFSBucket(db,{ bucketName:'tracks' });//guardamos el nombre del archivo
    let uploadStream =bucket.openUploadStream(trackName);
    const id=uploadStream.id;//guardamos la id del archivo
    archivoleible.pipe(uploadStream);
    // funcion para mostrar si ahi un error subiendo el archivo
    uploadStream.on('error',()=>{
        return res.status(405).json({message:'error al subir el archivo'});
    });
    //funcion para decir que el archivo se subio correctamente
    uploadStream.on('finish',()=>{
        return res.status(406).json({message:'archivo subido correctamente, con la siguiente ID:  '+id});
    });

    });
    

}
//exportamos las funciones
module.exports={
    getTrack,
    guardarTrack
}