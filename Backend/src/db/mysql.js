const mysql = require('mysql2/promise');
const config = require('../config/env');

// Respeta el límite del proveedor (Clever Cloud suele permitir ~5 por usuario)
const DEFAULT_CONN_LIMIT = Number(process.env.MYSQL_CONNECTION_LIMIT || 5);

// Usar un singleton global para evitar abrir múltiples pools en recargas del servidor
// (por ejemplo, con nodemon) y agotar max_user_connections
function getGlobalPool() {
  if (!global.__mysqlPool) {
    global.__mysqlPool = mysql.createPool(buildOptions());
  }
  return global.__mysqlPool;
}

function buildOptions() {
  // Si viene URL, la parseamos para construir un objeto de opciones
  if (config.mysql.url) {
    const u = new URL(config.mysql.url);
    const opts = {
      host: u.hostname,
      port: Number(u.port || 3306),
      user: decodeURIComponent(u.username || ''),
      password: decodeURIComponent(u.password || ''),
      database: decodeURIComponent(u.pathname ? u.pathname.replace(/^\//, '') : ''),
      waitForConnections: true,
      // Mantener el límite por debajo del permitido por el proveedor
      connectionLimit: DEFAULT_CONN_LIMIT,
      queueLimit: 0,
    };
    // SSL opcional: aceptar 'require' o parámetros comunes en la URL
    const sslParam = (config.mysql.ssl || u.searchParams.get('ssl') || u.searchParams.get('sslmode') || u.searchParams.get('sslMode'));
    if (sslParam) {
      opts.ssl = sslParam === 'require' || sslParam === 'true' ? { rejectUnauthorized: false } : sslParam;
    }
    return opts;
  }
  // Config tradicional por partes
  const base = {
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    waitForConnections: true,
    connectionLimit: DEFAULT_CONN_LIMIT,
    queueLimit: 0,
  };
  if (config.mysql.ssl) {
    base.ssl = config.mysql.ssl === 'require' ? { rejectUnauthorized: false } : config.mysql.ssl;
  }
  return base;
}

function getPool() {
  return getGlobalPool();
}

async function closePool() {
  if (global.__mysqlPool) {
    try { await global.__mysqlPool.end(); } catch {}
    global.__mysqlPool = undefined;
  }
}

async function query(sql, params) {
  const p = getPool();
  // pool.execute toma y libera la conexión automáticamente
  const [rows] = await p.execute(sql, params);
  return rows;
}

// Cierre ordenado en parada del proceso
process.on('SIGINT', async () => { await closePool(); process.exit(0); });
process.on('SIGTERM', async () => { await closePool(); process.exit(0); });

module.exports = { getPool, query, closePool };
