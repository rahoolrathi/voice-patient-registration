require("dotenv").config();

const dbSettings = {
  use_env_variable: "DATABASE_URL",
  dialect: "postgres",
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
};

module.exports = {
  development: dbSettings,
  test: dbSettings,
  production: dbSettings,
};
