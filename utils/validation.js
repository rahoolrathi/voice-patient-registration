const { SEX_OPTIONS } = require('../enums/patient.enums');

const REQUIRED_FIELDS = [
  'first_name', 'last_name', 'date_of_birth', 'sex', 'phone_number',
  'address_line_1', 'city', 'state', 'zip_code',
];

// checks the rules from the spec - plain if statements, nothing fancy
function validatePatient(body, { partial = false } = {}) {
  const errors = [];

  if (!partial) {
    for (const field of REQUIRED_FIELDS) {
      if (!body[field]) errors.push(`${field} is required`);
    }
  }

  if (body.first_name && !/^[A-Za-z'-]{1,50}$/.test(body.first_name)) {
    errors.push('first_name must be letters only (1-50 chars)');
  }
  if (body.last_name && !/^[A-Za-z'-]{1,50}$/.test(body.last_name)) {
    errors.push('last_name must be letters only (1-50 chars)');
  }
  if (body.date_of_birth) {
    const dob = new Date(body.date_of_birth);
    if (isNaN(dob.getTime())) errors.push('date_of_birth is not a valid date');
    else if (dob > new Date()) errors.push('date_of_birth cannot be in the future');
  }
  if (body.sex && !SEX_OPTIONS.includes(body.sex)) {
    errors.push(`sex must be one of: ${SEX_OPTIONS.join(', ')}`);
  }
  if (body.phone_number && !/^[0-9]{10}$/.test(body.phone_number)) {
    errors.push('phone_number must be exactly 10 digits');
  }
  if (body.emergency_contact_phone && !/^[0-9]{10}$/.test(body.emergency_contact_phone)) {
    errors.push('emergency_contact_phone must be exactly 10 digits');
  }
  if (body.zip_code && !/^[0-9]{5}(-[0-9]{4})?$/.test(body.zip_code)) {
    errors.push('zip_code must be 5 digits or ZIP+4 format');
  }
  if (body.state && !/^[A-Za-z]{2}$/.test(body.state)) {
    errors.push('state must be a 2-letter abbreviation');
  }
  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push('email is not a valid email address');
  }

  return errors;
}

module.exports = { validatePatient };
