// backend/index.js
const express = require('express');
const cors = require('cors');
const { db } = require('./firebase');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/test', async (req, res) => {
  try {
    const snapshot = await db.collection('testData').get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log('✅ Backend running on http://localhost:5000');
});
