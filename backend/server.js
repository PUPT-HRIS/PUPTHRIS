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
const childrenRoutes = require('./routes/childrenRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const specialSkillRoutes = require('./routes/specialSkillRoutes');
const nonAcademicRoutes = require('./routes/nonacademicRoutes');
const membershipRoutes = require('./routes/membershipRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/employees', employeeRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/familybackground', familybackgroundRoutes);
app.use('/api/civilservice', civilserviceeligibilityRoutes);
app.use('/api/workexperience', workexperienceRoutes);
app.use('/api/voluntarywork', voluntaryworkRoutes);
app.use('/api/learningdevelopment', learningdevelopmentRoutes);
app.use('/api/children', childrenRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/specialskills', specialSkillRoutes);
app.use('/api/nonacademic', nonAcademicRoutes);
app.use('/api/membership', membershipRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
