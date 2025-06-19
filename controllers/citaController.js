const { sql, poolPromise } = require('../config/db');

function generarCodigoCita() {
  return Math.floor(100000 + Math.random() * 900000);
}

const agendarCita = async (req, res) => {
  try {
    const { doctor_id, paciente_id, fechaHora,motivo } = req.body;

    if (!doctor_id || !paciente_id || !fechaHora||!motivo) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const fechaHoraDate = new Date(fechaHora);
    if (isNaN(fechaHoraDate.getTime())) {
      return res.status(400).json({ error: 'Fecha y hora inválida' });
    }

    const codigoCita = generarCodigoCita();
    const pool = await poolPromise;

    const result = await pool.request()
      .input('codigoCita', sql.Int, codigoCita)
      .input('doctor_id', sql.Int, doctor_id)
      .input('paciente_id', sql.Int, paciente_id)
      .input('fechaHora', sql.DateTime, fechaHoraDate)
      .input('motivo',sql.VarChar,motivo)
      .input('activo', sql.Bit, 1)
      .query(`
        INSERT INTO Citas (codigoCita, doctor_id, paciente_id, fechaHora,motivo, activo)
        OUTPUT inserted.idCita, inserted.fecha_cita
        VALUES (@codigoCita, @doctor_id, @paciente_id, @fechaHora,@motivo, @activo);
      `);

    const cita = result.recordset[0];

    res.status(201).json({
      mensaje: 'Cita agendada correctamente',
      idCita: cita.idCita,
      codigoCita,
      fecha_cita: cita.fecha_cita
    });
  } catch (error) {
    console.error('Error al agendar cita:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerDoctores = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT d.idDoctor, d.nombre, e.nombre AS especialidad
        FROM Doctor d
        INNER JOIN Especialidad e ON d.especialidad_id = e.idEspecialidad
        WHERE d.activo = 1;
      `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener doctores:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerPacientes = async (req, res) => {
  const correo = req.query.correo;
  if (!correo) return res.status(400).json({ error: 'Falta el parámetro correo' });

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('correo', sql.VarChar(50), correo)
      .query(`
        SELECT idPaciente, (nombre + ' ' + apellidos) AS nombreCompleto
        FROM Paciente
        WHERE correo_electronico = @correo
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error al buscar paciente por correo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  agendarCita,
  obtenerDoctores,
  obtenerPacientes
};
