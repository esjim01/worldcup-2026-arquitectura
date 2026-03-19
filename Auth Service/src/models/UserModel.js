const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // No puede haber dos iguales
    password: { type: String, required: true },
    edad: { type: Number, required: true },
    rol: { 
        type: String, 
        enum: ['USER', 'ADMIN'], // Solo permite estos dos valores 
        default: 'USER' 
    }
}, { timestamps: true }); // Guarda automáticamente cuándo se creó el usuario

module.exports = mongoose.model('User', UserSchema);