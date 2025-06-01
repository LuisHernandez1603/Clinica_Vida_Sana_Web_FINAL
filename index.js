const express = require('express');
const cors = require('cors'); // 👈 importa cors
const app = express();

// Habilita CORS para todas las rutas
app.use(cors()); //esto permite peticiones desde otros orígenes

app.use(express.json());

// Tus Ruta paciente solicitud api
const pacienteRoutes = require('./routers/pacienteRoutes');
app.use(pacienteRoutes);
//ruta cita agg solicitud api
const citaRoutes = require('./routers/citaRoutes');
app.use('/', citaRoutes);
//ruta dashboard llenar

app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
