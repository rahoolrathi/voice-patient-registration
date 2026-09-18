const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { SEX_OPTIONS } = require("../enums/patient.enums");

const Patient = sequelize.define(
  "Patient",
  {
    patient_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    first_name: { type: DataTypes.STRING(50), allowNull: false },
    last_name: { type: DataTypes.STRING(50), allowNull: false },
    date_of_birth: { type: DataTypes.DATEONLY, allowNull: false },
    sex: { type: DataTypes.ENUM(...SEX_OPTIONS), allowNull: false },
    phone_number: { type: DataTypes.STRING(10), allowNull: false },
    address_line_1: { type: DataTypes.STRING(255), allowNull: false },
    city: { type: DataTypes.STRING(100), allowNull: false },
    state: { type: DataTypes.CHAR(2), allowNull: false },
    zip_code: { type: DataTypes.STRING(10), allowNull: false },

    email: { type: DataTypes.STRING(255), allowNull: true },
    address_line_2: { type: DataTypes.STRING(255), allowNull: true },
    insurance_provider: { type: DataTypes.STRING(255), allowNull: true },
    insurance_member_id: { type: DataTypes.STRING(100), allowNull: true },
    preferred_language: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "English",
    },
    emergency_contact_name: { type: DataTypes.STRING(255), allowNull: true },
    emergency_contact_phone: { type: DataTypes.STRING(10), allowNull: true },
  },
  {
    tableName: "patients",
    underscored: true,

    paranoid: true,
    deletedAt: "deleted_at",
  },
);

module.exports = Patient;
