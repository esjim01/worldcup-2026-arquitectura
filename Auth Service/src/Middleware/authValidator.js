const Joi = require('joi');

const validarRegistro = (req, res, next) => {
    const schema = Joi.object({
        nombre: Joi.string().required(),
        apellido: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        edad: Joi.number().min(18).required() // Validación de mayoría de edad
    });

    const { error } = schema.validate(req.body);
    
    if (error) {
        // RNF-01: Respuesta rápida (menos de 2s) indicando el error 
        return res.status(400).json({ mensaje: error.details[0].message });
    }
    
    next(); // Si todo está bien, pasa al siguiente paso (el controlador)
};

module.exports = { validarRegistro };