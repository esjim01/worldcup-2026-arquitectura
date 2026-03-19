const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');

exports.registrar = async (req, res) => {
    try {
        const { nombre, apellido, email, password, edad } = req.body;

        // 1. Encriptar la contraseña (Seguridad RNF-04) 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 2. Crear el nuevo usuario usando el modelo
        const nuevoUsuario = new User({
            nombre,
            apellido,
            email,
            password: hashedPassword,
            edad
        });

        // 3. Guardar en la base de datos
        await nuevoUsuario.save();

        res.status(201).json({ mensaje: "Usuario creado con éxito" });
    } catch (err) {
        res.status(500).json({ mensaje: "Error al registrar", error: err.message });
    }
};