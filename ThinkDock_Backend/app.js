const express = require('express');
const cors = require('cors');
const fileRoutes = require('./routes/fileRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/files', fileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`ThinkDock backend running on port ${PORT}`));
