require('dotenv').config(); // Carga las variables del archivo .env
const express = require('express');
const mongoose = require('mongoose'); // Aqui se reemplaza el require de mongoose para conectar a la base de datos
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware para que el servidor entienda el formato JSON
app.use(express.json());

// Conexión a la Base de Datos (MongoDB)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Conectado a MongoDB"))
    .catch((err) => console.error("❌ Error de conexión:", err));

// Usamos las rutas que definimos
// Todas las rutas de este archivo empezarán con /api/auth
app.use('/api/auth', authRoutes);

// Puerto de escucha (RNF-01: Rendimiento)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Auth Service corriendo en http://localhost:${PORT}`);
});