require('dotenv').config();

module.exports = {
  development: {
    database: process.env.POSTGRES_DB || 'rawdatadev',
    username: process.env.POSTGRES_USER || 'dbuser',
    password: process.env.POSTGRES_PASSWORD || 'dbpassword',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    dialect: 'postgres',
  },
  test: {
    database: process.env.POSTGRES_DB || 'rawdatatest',
    username: process.env.POSTGRES_USER || 'dbuser',
    password: process.env.POSTGRES_PASSWORD || 'dbpassword',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    dialect: 'postgres',
  },
  production: {
    database: process.env.POSTGRES_DB || 'rawdata',
    username: process.env.POSTGRES_USER || 'dbuser',
    password: process.env.POSTGRES_PASSWORD || 'dbpassword',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    dialect: 'postgres',
    // disable logging; default: console.log
    logging: false,
  },
};
