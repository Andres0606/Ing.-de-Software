const mysql = require('mysql2/promise');
const config = require('../config/env');

let pool;

function buildConfig() {
  if (config.mysql.url) {
    const cfg = { uri: config.mysql.url };
    if (config.mysql.ssl) {
      cfg.ssl = config.mysql.ssl === 'require' ? { rejectUnauthorized: false } : config.mysql.ssl;
    }
    return cfg;
  }
  const base = {
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
  if (config.mysql.ssl) {
    base.ssl = config.mysql.ssl === 'require' ? { rejectUnauthorized: false } : config.mysql.ssl;
  }
  return base;
}

function getPool() {
  if (!pool) {
    const cfg = buildConfig();
    pool = config.mysql.url
      ? mysql.createPool(cfg.uri)
      : mysql.createPool(cfg);
  }
  return pool;
}

async function query(sql, params) {
  const p = getPool();
  const [rows] = await p.execute(sql, params);
  return rows;
}

module.exports = { getPool, query };
