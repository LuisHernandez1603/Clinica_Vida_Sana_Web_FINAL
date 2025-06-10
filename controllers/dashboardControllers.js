const { sql, poolPromise } = require('../config/db');

async function obtenerKPIs(req, res) {
  try {
    const pool = await poolPromise;

    // Pacientes registrados por mes
    const pacientesQuery = await pool.request().query(`
      SELECT 
        FORMAT(fecha_registro, 'yyyy-MM') AS mes, 
        COUNT(*) AS total 
      FROM Paciente
      GROUP BY FORMAT(fecha_registro, 'yyyy-MM') 
      ORDER BY mes
    `);

    // Citas registradas por mes (sin filtrar por estado porque no existe esa columna)
    const citasQuery = await pool.request().query(`
      SELECT 
        FORMAT(fecha_cita, 'yyyy-MM') AS mes, 
        COUNT(*) AS total 
      FROM Citas
      GROUP BY FORMAT(fecha_cita, 'yyyy-MM') 
      ORDER BY mes
    `);

    res.json({
      pacientes: {
        meses: pacientesQuery.recordset.map(row => row.mes),
        valores: pacientesQuery.recordset.map(row => row.total),
      },
      citas: {
        meses: citasQuery.recordset.map(row => row.mes),
        valores: citasQuery.recordset.map(row => row.total),
      },
    });

  } catch (error) {
    console.error('Error al obtener KPIs:', error);
    res.status(500).json({ error: 'Error al obtener KPIs desde la base de datos' });
  }
}

module.exports = {
  obtenerKPIs
};
