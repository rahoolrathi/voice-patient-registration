'use strict';
const crypto = require('crypto');

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('patients', [
      {
        patient_id: crypto.randomUUID(),
        first_name: 'Jane',
        last_name: 'Doe',
        date_of_birth: '1990-04-12',
        sex: 'Female',
        phone_number: '5125550111',
        email: 'jane.doe@example.com',
        address_line_1: '123 Main St',
        city: 'Austin',
        state: 'TX',
        zip_code: '78701',
        preferred_language: 'English',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        patient_id: crypto.randomUUID(),
        first_name: 'John',
        last_name: 'Smith',
        date_of_birth: '1985-11-02',
        sex: 'Male',
        phone_number: '5125550199',
        address_line_1: '456 Oak Ave',
        city: 'Austin',
        state: 'TX',
        zip_code: '78702',
        preferred_language: 'English',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('patients', null, {});
  },
};
