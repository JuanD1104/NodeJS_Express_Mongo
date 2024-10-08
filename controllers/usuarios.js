const express = require('express');
const Usuario = require('../models/usuario_model');
const Joi = require('@hapi/joi');
const ruta = express.Router();

ruta.get('/',(req,res)=>{
    res.json('Respuesta a peticion GET de USUARIOS funcionando correctamente...');
});


module.exports = ruta;

//Validaciones para el objeto usuario
const schema = Joi.object({
    nombre: Joi.string()
        .min(3)
        .max(30)
        .required()
        .pattern(/^[A-Za-záéíóú ]{3,30}$/),

    password: Joi.string()
        .pattern(/^[a-zA-Z0-9]{3,30}$/),

    email: Joi.string()
        .email({minDomainSegments: 2, tlds: { allow: ['com', 'net', 'edu','co']}})
});

//Funcion asincronica para crear un objeto de tipo usuario
async function crearUsuario(body){
    let usuario = new Usuario({
        email       : body.email,
        nombre      : body.nombre,
        password    : body.password
    });
    return await usuario.save();
}

// Endpoint de tipo POST para el recurso USUARIOS
ruta.post('/', (req, res) => {
    let body = req.body;

    const {error, value} = schema.validate({nombre: body.nombre, email: body.email});
    if (!error){
        let resultado = crearUsuario(body);

        resultado.then(user => {
            res.json({
                valor: user
            });
        }).catch(err => {
            res.status(400).json({
                err
            });
        });
    } else {
        res.status(400).json({
            error
        });
    }
});

//Funcion asincronica para actualizar datos de tipo usuario
async function actualizarUsuario(email, body) {
    let usuario = await Usuario.findOneAndUpdate({ "email": email }, {
            $set: {
                nombre: body.nombre,
                password: body.password
            }
        }, { new: true});
        return usuario;
}

//Endpoint de tipo PUT para actualizar los datos del usuario
ruta.put('/:email', (req, res) => {
    const {error, value} = schema.validate({nombre: req.body.nombre});
    console.log(value);
    if (!error){
        let resultado = actualizarUsuario(req.params.email, req.body);
        resultado.then(valor => {
            res.json({
                valor
            })
        }).catch(err => {
            res.status(400).json({
                err
            })
        });
    }else{
        res.status(400).json({
            error
        })
    }
});
