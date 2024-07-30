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

exports.updateCivilServiceEligibility = async (req, res) => {
  try {
    const eligibilityId = req.params.id;
    const updatedData = req.body;
    const result = await CivilServiceEligibility.update(updatedData, {
      where: { CivilServiceEligibilityID: eligibilityId }
    });
    if (result[0] === 0) {
      res.status(404).send('Civil Service Eligibility record not found');
    } else {
      res.status(200).send('Civil Service Eligibility updated successfully');
    }
  } catch (err) {
    console.error('Error updating civil service eligibility:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.getCivilServiceEligibility = async (req, res) => {
  try {
    const eligibilityId = req.params.id;
    const civilServiceEligibility = await CivilServiceEligibility.findOne({ where: { CivilServiceEligibilityID: eligibilityId } });
    if (civilServiceEligibility) {
      res.status(200).json(civilServiceEligibility);
    } else {
      res.status(404).send('Civil Service Eligibility record not found');
    }
  } catch (error) {
    console.error('Error getting civil service eligibility:', error);
    res.status(500).send('Internal Server Error');
  }
};