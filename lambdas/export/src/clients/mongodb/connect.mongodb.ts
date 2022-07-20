const mongojs = require("mongojs");
const mongodb = mongojs(process.env.MONGODB_HOST);
export default mongodb;
