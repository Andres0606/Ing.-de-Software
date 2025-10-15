// Centralized environment configuration
// Loads variables from .env at Backend root and exposes typed config
require('dotenv').config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  mysql: {
    // Either a single URL or discrete settings
    url: process.env.MYSQL_URL || '',
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || '',
    // e.g. 'require' to allow self-signed in some providers, or JSON for advanced options
    ssl: process.env.MYSQL_SSL || '',
  },
};

module.exports = env;
// Simple env loader to centralize configuration (MySQL-ready)
require('dotenv').config();

const {
  NODE_ENV = 'development',
  PORT = '3000',
  // MySQL connection
  MYSQL_URL,
  MYSQL_HOST = 'localhost',
  MYSQL_PORT = '3306',
  MYSQL_USER = 'root',
  MYSQL_PASSWORD = '',
  MYSQL_DATABASE = 'ingsoftware_db',
  // Optional: set to 'require' to enable basic SSL without cert validation
  MYSQL_SSL,
} = process.env;

module.exports = {
  nodeEnv: NODE_ENV,
  port: Number(PORT),
  mysql: {
    url: MYSQL_URL,
    host: MYSQL_HOST,
    port: Number(MYSQL_PORT),
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    ssl: MYSQL_SSL,
  },
};
