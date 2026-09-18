const { Op } = require("sequelize");
const Patient = require("../models/patient.model");

async function findAll(filters = {}) {
  const where = {};

  if (filters.last_name) where.last_name = { [Op.iLike]: filters.last_name };
  if (filters.date_of_birth) where.date_of_birth = filters.date_of_birth;
  if (filters.phone_number) where.phone_number = filters.phone_number;

  return Patient.findAll({ where, order: [["created_at", "DESC"]] });
}

async function findById(id) {
  return Patient.findByPk(id);
}

async function findByPhoneNumber(phone) {
  return Patient.findOne({ where: { phone_number: phone } });
}

async function create(data) {
  return Patient.create(data);
}

async function update(id, data) {
  const patient = await Patient.findByPk(id);
  if (!patient) return null;
  return patient.update(data);
}

async function softDelete(id) {
  const patient = await Patient.findByPk(id);
  if (!patient) return null;
  await patient.destroy();
  return patient;
}

module.exports = {
  findAll,
  findById,
  findByPhoneNumber,
  create,
  update,
  softDelete,
};
