// controllers/dashboardController.js
const sql = require('mssql');

async function obtenerDatosDashboard(req, res) {
  try {
    // Consulta total pacientes
    const pacientesResult = await sql.query`SELECT COUNT(*) AS totalPacientes FROM Pacientes`;
    const totalPacientes = pacientesResult.recordset[0].totalPacientes;

    // Consulta total citas
    const citasResult = await sql.query`SELECT COUNT(*) AS totalCitas FROM DimCitas`;
    const totalCitas = citasResult.recordset[0].totalCitas;

    // Consulta citas por mes (ejemplo simple)
    const DimCitas = await sql.query`
      SELECT 
        FORMAT(fecha, 'MMMM') AS mes, 
        COUNT(*) AS totalCitas 
      FROM Citas 
      GROUP BY FORMAT(fecha, 'MMMM'), DATEPART(month, fecha)
      ORDER BY DATEPART(month, fecha)
    `;
    const citasMensuales = citasMensualesResult.recordset;

    res.json({
      totalPacientes,
      totalCitas,
      citasMensuales
    });

  } catch (error) {
    console.error('Error obteniendo datos dashboard:', error);
    res.status(500).json({ mensaje: 'Error al obtener datos del dashboard' });
  }
}

module.exports = {
  obtenerDatosDashboard
};
