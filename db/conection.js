const sql = require('mssql');

const config = {
  user: 'clinica_user',
  password: 'ClinicaNueva123$',
  server: 'LUIS_HERNANDEZ',
  database: 'multisimencional',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function getConnection() {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (error) {
    console.error('DB Connection Error:', error);
    throw error;
  }
}

module.exports = {
  sql,
  getConnection,
};
