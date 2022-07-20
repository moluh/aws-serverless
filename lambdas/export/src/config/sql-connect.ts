const EasyPostgres = require("easy-postgres");

const sql_db = EasyPostgres({
  database: process.env.SQL_DATABASE,
  host: process.env.SQL_HOST,
  port: process.env.SQL_PORT,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
});

export default sql_db;
