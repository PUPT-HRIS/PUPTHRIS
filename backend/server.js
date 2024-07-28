const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const employeeRoutes = require('./routes/employeeRoutes');
const educationRoutes = require('./routes/educationRoutes');
const familybackgroundRoutes = require('./routes/familybackgroundRoutes');
const civilserviceeligibilityRoutes = require('./routes/civilserviceeligibilityRoutes');
const workexperienceRoutes = require('./routes/workexperienceRoutes');
const voluntaryworkRoutes = require('./routes/voluntaryworkRoutes');
const learningdevelopmentRoutes = require('./routes/learningdevelopmentRoutes');
const otherinformationRoutes = require('./routes/otherinformationRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/employees', employeeRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/family', familybackgroundRoutes);
app.use('/api/civilservice', civilserviceeligibilityRoutes);
app.use('/api/workexperience', workexperienceRoutes);
app.use('/api/voluntarywork', voluntaryworkRoutes);
app.use('/api/learningdevelopment', learningdevelopmentRoutes);
app.use('/api/otherinformation', otherinformationRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
