const express = require('express');
const cors = require('cors'); // 👈 importa cors
const app = express();

// Habilita CORS para todas las rutas
app.use(cors()); //esto permite peticiones desde otros orígenes

app.use(express.json());

// Tus rutas
const pacienteRoutes = require('./routers/pacienteRoutes');
app.use(pacienteRoutes);

app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
