const sql = require('mssql');

const config = {
  user: 'clinica_user',
  password: 'ClinicaNueva123$',
  server: 'LUIS_HERNANDEZ',
  database: 'Clinica_Vida_Sana_OLTP',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const poolPromise = sql.connect(config)
  .then(pool => {
    console.log('Conectado a SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('Error al conectar a la BD', err);
    throw err;
  });

module.exports = {
  sql,
  poolPromise,
};
