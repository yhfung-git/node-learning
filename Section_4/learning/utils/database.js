const mysql = require("mysql2");

require("dotenv").config();

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbName = process.env.DB_NAME;
const dbPassword = process.env.DB_PASSWORD;

const pool = mysql.createPool({
  host: dbHost,
  user: dbUser,
  database: dbName,
  password: dbPassword,
});

module.exports = pool.promise();
