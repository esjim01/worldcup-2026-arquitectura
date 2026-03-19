const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const tokenService = require('../services/tokenService');

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

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Buscar si el usuario existe
        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(401).json({ mensaje: "Credenciales inválidas" });
        }

        // 2. Comparar la contraseña enviada con la de la DB (Seguridad )
        const esValida = await bcrypt.compare(password, usuario.password);
        if (!esValida) {
            return res.status(401).json({ mensaje: "Credenciales inválidas" });
        }

        // 3. Generar el Token JWT (RF-02 )
        const token = tokenService.crearToken(usuario);

        // 4. Responder al cliente
        res.status(200).json({
            mensaje: "Login exitoso",
            token: token,
            user: { nombre: usuario.nombre, rol: usuario.rol }
        });
    } catch (err) {
        res.status(500).json({ mensaje: "Error en el servidor", error: err.message });
    }
};