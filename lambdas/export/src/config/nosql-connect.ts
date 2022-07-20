const mongojs = require("mongojs");
const no_sql_db = mongojs(process.env.MONGODB_HOST);
export default no_sql_db;
