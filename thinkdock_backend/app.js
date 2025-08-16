const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;

// Serve static files from "public"
app.use(express.static(path.join(__dirname, 'public')));

// Default route → serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public','index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
