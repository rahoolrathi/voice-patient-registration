const patientRepository = require('../repositories/patient.repository');

// Vapi sends: { message: { toolCalls: [{ id, function: { name, arguments } }] } }
// Vapi wants back: { results: [{ toolCallId, result: "<string>" }] }
async function handleToolCall(req, res) {
  const toolCalls = req.body?.message?.toolCalls || [];
  const results = [];

  for (const call of toolCalls) {
    const toolCallId = call.id;
    const name = call.function?.name;
    const args = call.function?.arguments || {};

    try {
      let result;

      if (name === 'find_patient_by_phone') {
        const patient = await patientRepository.findByPhoneNumber(args.phone_number);
        result = patient ? { found: true, patient } : { found: false };
      } else if (name === 'create_patient') {
        const patient = await patientRepository.create(args);
        result = { success: true, patient };
      } else if (name === 'update_patient') {
        const { patient_id, ...fields } = args;
        const patient = await patientRepository.update(patient_id, fields);
        result = patient ? { success: true, patient } : { success: false, error: 'Patient not found' };
      } else {
        result = { success: false, error: `Unknown tool: ${name}` };
      }

      results.push({ toolCallId, result: JSON.stringify(result) });
    } catch (err) {
      console.error(`Tool "${name}" failed:`, err.message);
      results.push({ toolCallId, result: JSON.stringify({ success: false, error: err.message }) });
    }
  }

  res.status(200).json({ results });
}

module.exports = { handleToolCall };
