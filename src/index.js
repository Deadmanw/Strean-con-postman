const express=require('express');
const morgan=require('morgan');

const cors=require('cors');

const tracksRoutes=require('./rutas/tracks.routes');
//inicializamos
const app= express();

app.use(cors());
app.use(morgan('dev'));

// rutas
app.use(tracksRoutes);

app.listen(8083);

console.log('server en el puerto',8083);