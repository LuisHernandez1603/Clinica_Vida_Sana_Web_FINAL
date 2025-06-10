const { sql, poolPromise } = require('../config/db');

async function registrarDoctor(req, res) {
  const { nombre, apellidos, telefono, correo, especialidad_id } = req.body;

  if (!nombre || !apellidos || !telefono || !correo || !especialidad_id) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('nombre', sql.VarChar(50), nombre)
      .input('apellidos', sql.VarChar(50), apellidos)
      .input('telefono', sql.VarChar(50), telefono)
      .input('correo_electronico', sql.VarChar(50), correo)
      .input('especialidad_id', sql.Int, especialidad_id)
      .query(`
        INSERT INTO Doctor (nombre, apellidos, telefono, correo_electronico, activo, especialidad_id)
        VALUES (@nombre, @apellidos, @telefono, @correo_electronico, 1, @especialidad_id)
      `);

    res.status(200).json({ mensaje: 'Doctor registrado correctamente' });
  } catch (error) {
    console.error('Error al insertar doctor:', error);
    res.status(500).json({ mensaje: 'Error al registrar doctor' });
  }
}

async function listarEspecialidades(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT idEspecialidad, nombre 
        FROM Especialidad 
        WHERE activo = 1
        ORDER BY nombre
      `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error al listar especialidades:', error);
    res.status(500).json({ mensaje: 'Error al obtener especialidades' });
  }
}

module.exports = {
  registrarDoctor,
  listarEspecialidades
};
