const Sequelize = require("sequelize");

const db = new Sequelize(
  process.env.DATABASE_URL ||
    "postgres://postgres:p455w0rd@localhost:5432/messenger",
  {
    logging: false,
  }
);

module.exports = db;
