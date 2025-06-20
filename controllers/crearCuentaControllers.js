const { sql, poolPromise } = require('../config/db');

async function crearCuentaPaciente(req, res) {
  const { username, password, confirmPassword } = req.body;

  if (!username || !password || !confirmPassword) {
    return res.status(400).json({ error: 'Faltan campos' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Las contraseñas no coinciden' });
  }

  try {
    const pool = await poolPromise;

    // Verificar si el usuario ya existe
    const checkUser = await pool.request()
      .input('username', sql.VarChar, username)
      .query('SELECT * FROM usuarios WHERE username = @username');

    if (checkUser.recordset.length > 0) {
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
    }

    // Insertar nuevo usuario con rol fijo 'paciente'
    await pool.request()
      .input('username', sql.VarChar, username)
      .input('password', sql.VarChar, password)
      .input('rol', sql.VarChar, 'paciente')
      .query('INSERT INTO usuarios (username, password, rol) VALUES (@username, @password, @rol)');

    res.status(201).json({ mensaje: 'Paciente registrado correctamente' });

  } catch (error) {
    console.error('Error al registrar paciente:', error);
    res.status(500).json({ error: 'Error del servidor al registrar usuario' });
  }
}

module.exports = 
{ 
  
  crearCuentaPaciente


};
