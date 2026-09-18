const express = require('express');
const patientController = require('../controllers/patient.controller');

const router = express.Router();

router.get('/', patientController.list);
router.get('/:id', patientController.getById);
router.post('/', patientController.create);
router.put('/:id', patientController.update);
router.delete('/:id', patientController.remove);

module.exports = router;
