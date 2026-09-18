const patientRepository = require('../repositories/patient.repository');
const { validatePatient } = require('../utils/validation');
const { ok, fail } = require('../utils/response');

async function list(req, res) {
  try {
    const { last_name, date_of_birth, phone_number } = req.query;
    const patients = await patientRepository.findAll({ last_name, date_of_birth, phone_number });
    return ok(res, 200, patients);
  } catch (err) {
    console.error(err);
    return fail(res, 500, 'Something went wrong');
  }
}

async function getById(req, res) {
  try {
    const patient = await patientRepository.findById(req.params.id);
    if (!patient) return fail(res, 404, 'Patient not found');
    return ok(res, 200, patient);
  } catch (err) {
    console.error(err);
    return fail(res, 500, 'Something went wrong');
  }
}

async function create(req, res) {
  try {
    const errors = validatePatient(req.body);
    if (errors.length > 0) return fail(res, 422, 'Validation failed', errors);

    const patient = await patientRepository.create(req.body);
    return ok(res, 201, patient);
  } catch (err) {
    console.error(err);
    return fail(res, 500, 'Something went wrong');
  }
}

async function update(req, res) {
  try {
    const errors = validatePatient(req.body, { partial: true });
    if (errors.length > 0) return fail(res, 422, 'Validation failed', errors);

    const patient = await patientRepository.update(req.params.id, req.body);
    if (!patient) return fail(res, 404, 'Patient not found');
    return ok(res, 200, patient);
  } catch (err) {
    console.error(err);
    return fail(res, 500, 'Something went wrong');
  }
}

async function remove(req, res) {
  try {
    const patient = await patientRepository.softDelete(req.params.id);
    if (!patient) return fail(res, 404, 'Patient not found');
    return ok(res, 200, { message: 'Patient deleted' });
  } catch (err) {
    console.error(err);
    return fail(res, 500, 'Something went wrong');
  }
}

module.exports = { list, getById, create, update, remove };
