const sql = require('mssql');

function generarCodigoInterno() {
  // Por ejemplo, un código alfanumérico de 6 caracteres
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let codigo = '';
  for (let i = 0; i < 6; i++) {
    codigo += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return codigo;
}

async function registrarEspecialidad(req, res) {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre || !descripcion) {
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios.' });
    }

    const codigo_interno = generarCodigoInterno();
    const activo = 1; // Siempre activo

    const query = `
      INSERT INTO Especialidad (nombre, descripcion, codigo_interno, activo)
      VALUES (@nombre, @descripcion, @codigo_interno, @activo);
    `;

    const pool = await sql.connect();

    await pool.request()
      .input('nombre', sql.VarChar(50), nombre)
      .input('descripcion', sql.VarChar(50), descripcion)
      .input('codigo_interno', sql.VarChar(50), codigo_interno)
      .input('activo', sql.Bit, activo)
      .query(query);

    res.json({ mensaje: 'Especialidad registrada correctamente.', codigo_interno });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar especialidad.' });
  }
}

module.exports = {
  registrarEspecialidad,
};
