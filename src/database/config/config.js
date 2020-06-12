require('dotenv').config();

module.exports = {
  development: {
    database: process.env.POSTGRES_DB || 'rawdatadev',
    username: process.env.POSTGRES_USER || 'dbuser',
    password: process.env.POSTGRES_PASSWORD || 'dbpassword',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    dialect: 'postgres',
    seederStorage: 'sequelize',
    seederStorageTableName: 'sequelize_data',
    // pool configuration used to pool database connections
    pool: {
      max: 5,
      idle: 30000,
      acquire: 60000,
    },
  },
  test: {
    database: process.env.POSTGRES_DB || 'rawdatatest',
    username: process.env.POSTGRES_USER || 'dbuser',
    password: process.env.POSTGRES_PASSWORD || 'dbpassword',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    dialect: 'postgres',
    seederStorage: 'sequelize',
    seederStorageTableName: 'sequelize_data',
    // pool configuration used to pool database connections
    pool: {
      max: 5,
      idle: 30000,
      acquire: 60000,
    },
  },
  production: {
    database: process.env.POSTGRES_DB || 'rawdata',
    username: process.env.POSTGRES_USER || 'dbuser',
    password: process.env.POSTGRES_PASSWORD || 'dbpassword',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    dialect: 'postgres',
    seederStorage: 'sequelize',
    seederStorageTableName: 'sequelize_data',
    // disable logging; default: console.log
    logging: false,
    // pool configuration used to pool database connections
    pool: {
      max: 5,
      idle: 30000,
      acquire: 60000,
    },
  },
};
