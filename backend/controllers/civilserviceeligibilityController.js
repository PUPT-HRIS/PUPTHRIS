const CivilServiceEligibility = require('../models/CivilServiceEligibility');

exports.addCivilServiceEligibility = async (req, res) => {
  try {
    const newCivilServiceEligibility = await CivilServiceEligibility.create(req.body);
    res.status(201).json(newCivilServiceEligibility);
  } catch (error) {
    console.error('Error adding civil service eligibility:', error);
    res.status(500).send('Internal Server Error');
  }
};
