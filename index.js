const usuarios = require('./controllers/usuarios');
const cursos = require('./controllers/cursos');


const express = require('express');
const mongoose = require('mongoose');

// Conexión a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/usercoursedb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB...'))
    .catch(err => console.log('No se pudo conectar con MongoDB...', err));

// middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//end poinst (recursos)
app.use('/api/usuarios', usuarios);
app.use('/api/cursos', cursos);

// Puerto de escucha del servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`API REST OK. Puerto ${port}`);
});
