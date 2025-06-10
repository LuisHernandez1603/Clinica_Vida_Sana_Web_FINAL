// controllers/authController.js
const sql = require('mssql');
const config = require('../config/db');

async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
  }

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('username', username)
      .query('SELECT username, password, rol FROM usuarios WHERE username = @username');

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const user = result.recordset[0];

    if (user.password !== password) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    res.json({ mensaje: 'Login exitoso', rol: user.rol });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { login };
