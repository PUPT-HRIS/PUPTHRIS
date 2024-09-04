const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db.config');

const educationRoutes = require('./routes/educationRoutes');
const familybackgroundRoutes = require('./routes/familybackgroundRoutes');
const civilserviceeligibilityRoutes = require('./routes/civilserviceeligibilityRoutes');
const workexperienceRoutes = require('./routes/workexperienceRoutes');
const voluntaryworkRoutes = require('./routes/voluntaryworkRoutes');
const learningdevelopmentRoutes = require('./routes/learningdevelopmentRoutes');
const childrenRoutes = require('./routes/childrenRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const basicDetailsRoutes = require('./routes/basicDetailsRoutes');
const contactDetailsRoutes = require('./routes/contactDetailsRoutes');
const characterReferenceRoutes = require('./routes/characterReferenceRoutes');
const additionalQuestionRoutes = require('./routes/additionalQuestionRoutes');
const personalDetailsRoutes = require('./routes/personalDetailsRoutes');
const trainingsRoutes = require('./routes/trainingsRoute');
const dashboardRoutes = require('./routes/dashboardRoutes');
const specialSkillRoutes = require('./routes/specialSkillRoutes');
const nonAcademicRoutes = require('./routes/nonAcademicRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const achievementAwardsRoutes = require('./routes/achievementAwardsRoutes');
const officershipMembershipRoutes = require('./routes/officerMembershipRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const profileImageRoutes = require('./routes/profileImageRoutes');
const userSignatureRoutes = require('./routes/userSignatureRoutes');

require('./models/associations');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/basic-details', basicDetailsRoutes);
app.use('/api/personaldetails', personalDetailsRoutes);
app.use('/api/trainings', trainingsRoutes);
app.use('/api/contact-details', contactDetailsRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/familybackground', familybackgroundRoutes);
app.use('/api/civilservice', civilserviceeligibilityRoutes);
app.use('/api/workexperience', workexperienceRoutes);
app.use('/api/voluntarywork', voluntaryworkRoutes);
app.use('/api/learningdevelopment', learningdevelopmentRoutes);
app.use('/api/character-reference', characterReferenceRoutes);
app.use('/api/additionalquestion', additionalQuestionRoutes);
app.use('/api/children', childrenRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/specialskills', specialSkillRoutes);
app.use('/api/nonacademic', nonAcademicRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/achievement-awards', achievementAwardsRoutes);
app.use('/api/officership-membership', officershipMembershipRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/profile-image', profileImageRoutes);
app.use('/api/user-signature', userSignatureRoutes);

sequelize.sync().then(() => {
  console.log('Database synced successfully');
  
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
}).catch(err => {
  console.error('Unable to sync database:', err);
});

