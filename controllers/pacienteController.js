const { sql, poolPromise } = require('../config/db');


async function registrarPaciente(req, res) {
  const { nombre, apellido, genero, edad,correo } = req.body;

  if (!nombre || !apellido || !genero || !edad ||!correo) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

   try {
    const { nombre, apellido, genero, edad, correo } = req.body;

    const pool = await poolPromise;
    await pool.request()
      .input('nombre', sql.VarChar, nombre)
      .input('apellido', sql.VarChar, apellido)
      .input('genero', sql.VarChar, genero)
      .input('edad', sql.Int, edad)
      .input('correo', sql.VarChar, correo)
      .query(`
        INSERT INTO DimPaciente (nombre, apellido, genero, edad, correo)
        VALUES (@nombre, @apellido, @genero, @edad, @correo)
      `);

    res.status(200).send({ mensaje: 'Paciente agregado correctamente' });
  } catch (error) {
    console.error('Error en la inserción:', error);
    res.status(500).send({ mensaje: 'Error al agregar paciente' });
  }
}

module.exports = { registrarPaciente };
