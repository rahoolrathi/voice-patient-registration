"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // needed so gen_random_uuid() / UUID defaults work on Postgres
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "pgcrypto";',
    );

    await queryInterface.createTable("patients", {
      patient_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

      first_name: { type: Sequelize.STRING(50), allowNull: false },
      last_name: { type: Sequelize.STRING(50), allowNull: false },
      date_of_birth: { type: Sequelize.DATEONLY, allowNull: false },
      sex: {
        type: Sequelize.ENUM("Male", "Female", "Other", "Decline to Answer"),
        allowNull: false,
      },
      phone_number: { type: Sequelize.STRING(10), allowNull: false },
      address_line_1: { type: Sequelize.STRING(255), allowNull: false },
      city: { type: Sequelize.STRING(100), allowNull: false },
      state: { type: Sequelize.CHAR(2), allowNull: false },
      zip_code: { type: Sequelize.STRING(10), allowNull: false },

      email: { type: Sequelize.STRING(255), allowNull: true },
      address_line_2: { type: Sequelize.STRING(255), allowNull: true },
      insurance_provider: { type: Sequelize.STRING(255), allowNull: true },
      insurance_member_id: { type: Sequelize.STRING(100), allowNull: true },
      preferred_language: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: "English",
      },
      emergency_contact_name: { type: Sequelize.STRING(255), allowNull: true },
      emergency_contact_phone: { type: Sequelize.STRING(10), allowNull: true },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });

    // speeds up the filters the API supports: ?last_name=, ?date_of_birth=, ?phone_number=
    await queryInterface.addIndex("patients", ["phone_number"]);
    await queryInterface.addIndex("patients", ["last_name"]);
    await queryInterface.addIndex("patients", ["date_of_birth"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("patients");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_patients_sex";',
    );
  },
};
