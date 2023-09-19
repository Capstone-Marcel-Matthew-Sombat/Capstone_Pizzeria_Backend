const POOL = require("pg").Pool;

const pool = new POOL({
  user: "churmagoon",
  host: "localhost",
  database: "capstone_pizzeria_db",
  password: "",
  port: 5432,
});

module.exports = pool;
