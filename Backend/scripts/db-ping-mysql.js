const { getPool } = require('../src/db/mysql');

(async () => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT NOW() AS now');
    const now = rows?.[0]?.now || rows?.[0]?.NOW || rows?.[0]?.['NOW()'];
    console.log('✅ Conexión MySQL OK. Hora del servidor:', now);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error de conexión a MySQL');
    console.error('- Detalle:', err && err.message);
    if (err && err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('> Credenciales inválidas. Revisa MYSQL_USER/MYSQL_PASSWORD o la URL.');
    } else if (err && err.code === 'ER_BAD_DB_ERROR') {
      console.error('> La base de datos no existe. Crea la DB indicada (MYSQL_DATABASE).');
    } else if (err && err.code === 'ECONNREFUSED') {
      console.error('> No se pudo conectar al host/puerto. Verifica el servicio MySQL y el puerto.');
    }
    process.exit(1);
  }
})();
