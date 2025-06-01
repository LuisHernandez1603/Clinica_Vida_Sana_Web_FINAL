const sql = require('mssql');
const config = require('../config/db');

function formatHora(hora) {
  if (/^\d{2}:\d{2}:\d{2}$/.test(hora)) return hora;
  if (/^\d{2}:\d{2}$/.test(hora)) return hora + ':00';
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
    const horaConSegundos = formatHora(hora);

    if (!horaConSegundos) {
      return res.status(400).json({ error: 'Formato de hora inválido' });
    }

    const pool = await sql.connect(config);
    const transaction = new sql.Transaction(pool);

    await transaction.begin();

    try {
      // Insertar en DimCitas
      const result = await transaction.request()
        .input('correo', sql.VarChar(255), correo)
        .input('fecha', sql.Date, fecha)
        .input('hora', sql.Time, stringAHora(horaConSegundos))
        .input('motivo', sql.VarChar(500), motivo)
        .input('estado', sql.VarChar(50), 'pendiente')
        .query(`
          INSERT INTO dbo.DimCitas (correo, fecha, hora, motivo, estado)
          VALUES (@correo, @fecha, @hora, @motivo, @estado);
          SELECT SCOPE_IDENTITY() AS idDimCita;
        `);

      const idDimCita = result.recordset[0].idDimCita;

      // Obtener idTiempo desde DimTiempo comparando solo año y mes
      const tiempoResult = await transaction.request()
        .input('fecha', sql.Date, fecha)
        .query(`
          SELECT TOP 1 idTiempo
          FROM dbo.DimTiempo
          WHERE YEAR(fecha) = YEAR(@fecha) AND MONTH(fecha) = MONTH(@fecha)
        `);

      const idTiempo = tiempoResult.recordset[0]?.idTiempo;

      if (!idTiempo) {
        await transaction.rollback();
        return res.status(400).json({ error: 'No se encontró idTiempo para el mes y año proporcionados' });
      }

      // Insertar en HechosCitas
      await transaction.request()
        .input('idDimCita', sql.Int, idDimCita)
        .input('idTiempo', sql.Int, idTiempo)
        .query(`
          INSERT INTO dbo.HechosCitas (idDimCita, idTiempo)
          VALUES (@idDimCita, @idTiempo);
        `);

      await transaction.commit();

      res.status(201).json({ message: 'Cita agendada con éxito', idDimCita });

    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Error al agendar cita:', error);
    res.status(500).json({ error: 'Error al agendar cita' });
  }
}

module.exports = { agendarCita };
