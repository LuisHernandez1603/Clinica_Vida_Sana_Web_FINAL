const express = require('express');
const cors = require('cors'); 
const app = express();
const session = require('express-session');


// app use seccion

app.use(session({
  secret: 'Luisxd22',   // Cambia esta clave a algo seguro
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }       // true solo si usas HTTPS
}));



// Habilita CORS para todas las rutas
app.use(cors()); //esto permite peticiones desde otros orígenes

app.use(express.json());

// Tus Ruta paciente solicitud api
const pacienteRoutes = require('./routers/pacienteRoutes');
app.use(pacienteRoutes);
//ruta cita agg solicitud api


//ruta dashboard llenar

// NUEVAS RUTAS doctor
const doctorRoutes = require('./routers/doctorRoutes');
app.use('/api', doctorRoutes);  // prefijo /api para mantener orden


// Rutas Login
const authRoutes = require('./routers/authRoutes');
app.use('/api', authRoutes);

// CrearCuenta
const crearCuentaRoutes = require('./routers/crearCuentaRoutes');
app.use('/', crearCuentaRoutes); // Aquí registrás la ruta

// Dashboard
const obtenerKPIs = require('./routers/dashboardRoutes');
app.use('/', obtenerKPIs);

// Citas
const citaRoutes = require('./routers/citaRoutes');  // <-- aquí la corrección
app.use('/citas', citaRoutes);


//CRUD ADMIN
const adminBajaRoutes = require('./routers/AdminBajaRoutes');
app.use('/adminbaja', adminBajaRoutes);
app.use('/api/admin', adminBajaRoutes);

// RegistrarEspecialidad

const especialidadRoutes = require('./routers/especialidadRoutes');
app.use('/', especialidadRoutes);





app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
