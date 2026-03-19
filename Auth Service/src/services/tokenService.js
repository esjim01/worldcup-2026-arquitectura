const jwt = require('jsonwebtoken');

// Función para crear el token
exports.crearToken = (usuario) => {
    // El "payload" es la información que viajará dentro del token
    const payload = {
        id: usuario._id,
        rol: usuario.rol // RF-03: Manejo de roles 
    };

    // Firmamos el token usando la clave secreta del .env
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '8h' // El token expira en 8 horas
    });
};