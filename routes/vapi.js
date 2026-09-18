const express = require('express');
const vapiController = require('../controllers/vapi.controller');

const router = express.Router();

router.post('/tool-call', vapiController.handleToolCall);

module.exports = router;
