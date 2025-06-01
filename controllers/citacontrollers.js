const { getConnection, sql } = require('../db/connection');

async function agendarCita(req, res) {
  const { correo, fechacita, horacita, motivo } = req.body;

  if (!correo || !fechacita || !horacita || !motivo) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input('FechaCita', sql.Date, fechacita)
      .input('HoraCita', sql.Time, horacita)
      .input('Motivo', sql.VarChar(255), motivo)
      .query(`
        INSERT INTO dbo.DimCitas (PacienteId, FechaCita, HoraCita, Motivo)
        VALUES (@PacienteId, @FechaCita, @HoraCita, @Motivo)
      `);

    res.json({ mensaje: 'Cita agendada con éxito' });
  } catch (error) {
    console.error('Error al agendar cita:', error);
    res.status(500).json({ error: 'Error al agendar cita' });
  }
}

module.exports = {
  agendarCita,
};
