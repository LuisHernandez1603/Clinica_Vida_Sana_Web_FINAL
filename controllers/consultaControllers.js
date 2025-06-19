const { sql, poolPromise } = require('../config/db');

// Función para generar código aleatorio para la consulta
function generarCodigoConsulta() {
  return Math.floor(100000 + Math.random() * 900000); // Número de 6 cifras
}

// GET /consultas/cita?codigo=xxx
const obtenerCitaPorCodigo = async (req, res) => {
  const codigo = req.query.codigo;
  if (!codigo) {
    return res.status(400).json({ error: 'Falta el parámetro código' });
  }

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('codigo', sql.Int, parseInt(codigo))
      .query(`
        SELECT c.idCita, c.codigoCita, 
               (p.nombre + ' ' + p.apellidos) AS pacienteNombre,
               (d.nombre + ' ' + d.apellidos) AS doctorNombre
        FROM Citas c
        INNER JOIN Paciente p ON c.paciente_id = p.idPaciente
        INNER JOIN Doctor d ON c.doctor_id = d.idDoctor
        WHERE c.codigoCita = @codigo AND c.activo = 1
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Código no encontrado' });
    }

    const cita = result.recordset[0];

    res.json({
      idCita: cita.idCita,
      codigoCita: cita.codigoCita,
      pacienteNombre: cita.pacienteNombre,
      doctorNombre: cita.doctorNombre
    });
  } catch (error) {
    console.error('Error al obtener cita por código:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// POST /consultas/registrar
const registrarConsulta = async (req, res) => {
  const { codigo_cita, descripcion, diagnostico, recomendaciones, activo } = req.body;

  if (!codigo_cita || !descripcion || !diagnostico) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const pool = await poolPromise;

    // Buscar el idCita correspondiente al código
    const citaResult = await pool.request()
      .input('codigoCita', sql.Int, parseInt(codigo_cita))
      .query(`SELECT idCita FROM Citas WHERE codigoCita = @codigoCita`);

    if (citaResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Cita no encontrada con ese código' });
    }

    const cita_id = citaResult.recordset[0].idCita;
    const codigoConsulta = generarCodigoConsulta();

    // Insertar la consulta
    await pool.request()
      .input('descripcion', sql.VarChar(sql.MAX), descripcion)
      .input('diagnostico', sql.VarChar(sql.MAX), diagnostico)
      .input('recomendaciones', sql.VarChar(sql.MAX), recomendaciones || '')
      .input('codigoConsulta', sql.Int, codigoConsulta)
      .input('activo', sql.Bit, activo)
      .input('cita_id', sql.Int, cita_id)
      .query(`
        INSERT INTO Consulta (descripcion, diagnostico, recomendaciones, codigo_Consulta, activo, cita_id)
        VALUES (@descripcion, @diagnostico, @recomendaciones, @codigoConsulta, @activo, @cita_id)
      `);

    res.status(201).json({ mensaje: 'Consulta registrada correctamente', codigoConsulta });

  } catch (error) {
    console.error('Error al registrar consulta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  obtenerCitaPorCodigo,
  registrarConsulta
};
