require("dotenv").config();
const POOL = require("pg").Pool;

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "churmagoon";
const DB = process.env.DB || "capstone_pizzeria_db";
const DB_PASS = process.env.DB_PASS || "";
const DB_PORT = process.env.DB_PORT || 5432;

const pool = new POOL({
  user: DB_USER,
  host: DB_HOST,
  database: DB,
  password: DB_PASS,
  port: DB_PORT,
});

module.exports = pool; 
