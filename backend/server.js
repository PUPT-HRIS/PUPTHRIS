require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./config/db.config');

app.use(express.json());

app.get('/test-db', (req, res) => {
  db.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ solution: results[0].solution });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
