const sql = require('mssql');
const config = require('../config/db');

function formatHora(hora) {
  if (/^\d{2}:\d{2}:\d{2}$/.test(hora)) {
    return hora;
  }
  if (/^\d{2}:\d{2}$/.test(hora)) {
    return hora + ':00';
  }
  return null;
}

function stringAHora(horaStr) {
  const [hh, mm, ss] = horaStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hh, mm, ss || 0, 0);
  return date;
}

async function agendarCita(req, res) {
  try {
    const { correo, fecha, hora, motivo } = req.body;
    console.log('Hora recibida:', hora);

    const horaConSegundos = formatHora(hora);
    console.log('Hora formateada:', horaConSegundos);

    if (!horaConSegundos) {
      return res.status(400).json({ error: 'Formato de hora inválido' });
    }

    const [hh, mm, ss] = horaConSegundos.split(':').map(Number);
    if (
      hh < 0 || hh > 23 ||
      mm < 0 || mm > 59 ||
      ss < 0 || ss > 59
    ) {
      return res.status(400).json({ error: 'Hora fuera de rango' });
    }

    const pool = await sql.connect(config);

    await pool.request()
      .input('correo', sql.VarChar(255), correo)
      .input('fecha', sql.Date, fecha)
      .input('hora', sql.Time, stringAHora(horaConSegundos))  // Aquí va el objeto Date
      .input('motivo', sql.VarChar(500), motivo)
      .input('estado', sql.VarChar(50), 'pendiente')
      .query(`
        INSERT INTO dbo.DimCitas (correo, fecha, hora, motivo, estado)
        VALUES (@correo, @fecha, @hora, @motivo, @estado)
      `);

    res.status(201).json({ message: 'Cita agendada con éxito' });
  } catch (error) {
    console.error('Error al agendar cita:', error);
    res.status(500).json({ error: 'Error al agendar cita' });
  }
}

module.exports = { agendarCita };
