const express = require('express');
const router = express.Router();
const sql = require('mssql');

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

router.post('/registrar', async (req, res) => {
  const { nombre, apellido, genero, edad, correo } = req.body;

  if (!nombre || !apellido || !genero || !edad || !correo) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    await sql.connect(config);

    await sql.query`
      INSERT INTO dbo.DimPaciente(nombre, apellido, genero, edad, correo)
      VALUES (${nombre}, ${apellido}, ${genero}, ${edad}, ${correo})
    `;

    res.json({ mensaje: 'Paciente registrado con éxito' });
  } catch (error) {
    console.error('Error en la inserción:', error);
    res.status(500).json({ error: 'Error al registrar paciente' });
  }
});

module.exports = router;
