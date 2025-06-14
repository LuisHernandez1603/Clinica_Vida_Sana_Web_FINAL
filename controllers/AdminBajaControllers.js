const sql = require('mssql');

// Dar de baja lógica a Doctor, Paciente o Recepcionista
// Tipo: 'doctor', 'paciente' o 'recepcionista'
// id: el id del registro a desactivar
const darDeBaja = async (req, res) => {
  const { tipo, id } = req.body;

  if (!tipo || !id) {
    return res.status(400).json({ error: 'Falta tipo o id' });
  }

  let tabla, campoId;

  switch (tipo) {
    case 'doctor':
      tabla = 'Doctor';
      campoId = 'idDoctor';
      break;
    case 'paciente':
      tabla = 'Paciente';
      campoId = 'idPaciente';
      break;
    case 'recepcionista':
      tabla = 'Recepcionistas';
      campoId = 'id_Recepcionista';
      break;
    default:
      return res.status(400).json({ error: 'Tipo no válido. Debe ser doctor, paciente o recepcionista.' });
  }

  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`UPDATE ${tabla} SET activo = 0 WHERE ${campoId} = @id`);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: `${tipo} no encontrado` });
    }

    res.json({ mensaje: `${tipo} dado de baja correctamente.` });
  } catch (error) {
    console.error('Error al dar de baja:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


// Obtener todos activos para mostrar en lista (GET /adminbaja/:tipo)
const obtenerActivos = async (req, res) => {
  const { tipo } = req.params;

  let tabla, campoId, camposMostrar;

  switch (tipo) {
    case 'doctor':
      tabla = 'Doctor';
      campoId = 'idDoctor';
      camposMostrar = 'idDoctor, nombre, apellidos, correo_electronico, activo';
      break;
    case 'paciente':
      tabla = 'Paciente';
      campoId = 'idPaciente';
      camposMostrar = 'idPaciente, nombre, apellidos, correo_electronico';
      break;
    case 'recepcionista':
      tabla = 'Recepcionistas';
      campoId = 'id_Recepcionista';
      camposMostrar = 'id_Recepcionista, nombre, apellidos, correo_electronico';
      break;
    default:
      return res.status(400).json({ error: 'Tipo no válido. Debe ser doctor, paciente o recepcionista.' });
  }

  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .query(`SELECT ${camposMostrar} FROM ${tabla} WHERE activo = 1`);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener activos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }


};
const editarUsuario = async (req, res) => {
  const { tipo } = req.params;  // viene de la URL /:tipo/editar
  const { id, nombre, correo } = req.body;

  if (!tipo || !id || !nombre || !correo) {
    return res.status(400).json({ error: 'Faltan datos para editar' });
  }

  let tabla, campoId;

  switch (tipo) {
    case 'doctor':
      tabla = 'Doctor';
      campoId = 'idDoctor';
      break;
    case 'paciente':
      tabla = 'Paciente';
      campoId = 'idPaciente';
      break;
    case 'recepcionista':
      tabla = 'Recepcionistas';
      campoId = 'id_Recepcionista';
      break;
    default:
      return res.status(400).json({ error: 'Tipo no válido. Debe ser doctor, paciente o recepcionista.' });
  }

  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('nombre', sql.VarChar, nombre)
      .input('correo', sql.VarChar, correo)
      .query(`UPDATE ${tabla} SET nombre = @nombre, correo_electronico = @correo WHERE ${campoId} = @id`);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: `${tipo} no encontrado` });
    }

    res.json({ mensaje: `${tipo} editado correctamente.` });
  } catch (error) {
    console.error('Error al editar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


// Activar o desactivar usuario
const cambiarEstado = async (req, res) => {
  const { tipo, id, activo } = req.body;

  if (!tipo || !id || typeof activo === 'undefined') {
    return res.status(400).json({ error: 'Faltan parámetros tipo, id o activo' });
  }

  let tabla, campoId;

  switch (tipo) {
    case 'doctor':
      tabla = 'Doctor';
      campoId = 'idDoctor';
      break;
    case 'paciente':
      tabla = 'Paciente';
      campoId = 'idPaciente';
      break;
    case 'recepcionista':
      tabla = 'Recepcionistas';
      campoId = 'id_Recepcionista';
      break;
    default:
      return res.status(400).json({ error: 'Tipo inválido' });
  }

  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('activo', sql.Bit, activo)
      .query(`UPDATE ${tabla} SET activo = @activo WHERE ${campoId} = @id`);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const mensaje = activo === 1 ? 'activado' : 'desactivado';
    res.json({ mensaje: `Usuario ${mensaje} correctamente.` });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};



module.exports = {
  darDeBaja,
  obtenerActivos,
  editarUsuario,
  cambiarEstado
  
};
