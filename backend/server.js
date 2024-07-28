const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const employeeRoutes = require('./routes/employeeRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

 
app.use('/api/employees', employeeRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
