const express = require('express');
const sql = require('mssql');

const app = express();
app.use(express.json());

const config = {
  user: 'clinica_user',
  password: 'ClinicaNueva123$',
  server: 'LUIS_HERNANDEZ',
  database: 'multisimencional',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// Ruta POST para registrar paciente
app.post('/registrar-paciente', async (req, res) => {
  const { nombre, apellido, genero, edad } = req.body;

  if (!nombre || !apellido || !genero || !edad) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    // Conexión a la base de datos
    await sql.connect(config);

    // Inserción segura usando parámetros
    const result = await sql.query`
      INSERT INTO DimPaciente(nombre, apellido, genero, edad)
      VALUES (${nombre}, ${apellido}, ${genero}, ${edad})
    `;

    res.json({ mensaje: 'Paciente registrado con éxito' });
  } catch (error) {
    console.error('Error en la inserción:', error);
    res.status(500).json({ error: 'Error al registrar paciente' });
  }
});

// Servidor escuchando en puerto 3000
app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
