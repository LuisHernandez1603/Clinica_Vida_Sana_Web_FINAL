const { sql, poolPromise } = require('../config/db');

async function registrarPaciente(req, res) {
  // Extraemos los campos que necesitamos para la tabla Paciente
  const { numero_cedula, nombre, apellidos, fecha_nacimiento, correo_electronico } = req.body;

  // Validamos que todos los campos estén presentes
  if (!numero_cedula || !nombre || !apellidos || !fecha_nacimiento || !correo_electronico) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const pool = await poolPromise;
    await pool.request()
     .input('numero_cedula', sql.VarChar(20), req.body.numero_cedula)
      .input('nombre', sql.VarChar(50), nombre)
      .input('apellidos', sql.VarChar(50), apellidos)
      .input('fecha_nacimiento', sql.Date, fecha_nacimiento)
      .input('correo_electronico', sql.VarChar(50), correo_electronico)
      .query(`
        INSERT INTO Paciente (numero_cedula, nombre, apellidos, fecha_nacimiento, correo_electronico)
        VALUES (@numero_cedula, @nombre, @apellidos, @fecha_nacimiento, @correo_electronico)
      `);

    res.status(200).send({ mensaje: 'Paciente agregado correctamente' });
  } catch (error) {
    console.error('Error en la inserción:', error);
    res.status(500).send({ mensaje: 'Error al agregar paciente' });
  }
}

module.exports = { registrarPaciente };
