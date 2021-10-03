const { DataTypes } = require("sequelize");

const db = require("../../db");
const User = db.define("user", {
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
		require: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
		require: true,
  },
});

module.exports = User;
