require('dotenv').config();
const express = require('express');
const cors = require('cors');

const patientRoutes = require('./routes/patients');
const vapiRoutes = require('./routes/vapi');

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get('/health', (req, res) => {
  res.json({ data: { status: 'ok' }, error: null });
});

app.use('/patients', patientRoutes);
app.use('/vapi', vapiRoutes);

app.use((req, res) => {
  res.status(404).json({ data: null, error: { message: 'Route not found' } });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
