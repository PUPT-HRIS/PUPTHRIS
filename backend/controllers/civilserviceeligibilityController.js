const CivilServiceEligibility = require('../models/CivilServiceEligibility');

exports.addCivilServiceEligibility = async (req, res) => {
  try {
    const newCivilServiceEligibility = await CivilServiceEligibility.create({
      ...req.body,
      EmployeeID: req.user.userId
    });
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
      where: { CivilServiceEligibilityID: eligibilityId, EmployeeID: req.user.userId }
    });
    if (result[0] === 0) {
      res.status(404).send('Civil Service Eligibility record not found');
    } else {
      const updatedCivilServiceEligibility = await CivilServiceEligibility.findOne({ where: { CivilServiceEligibilityID: eligibilityId } });
      res.status(200).json(updatedCivilServiceEligibility);
    }
  } catch (err) {
    console.error('Error updating civil service eligibility:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.getCivilServiceEligibilitiesByEmployee = async (req, res) => {
  try {
    const employeeId = req.user.userId;
    const civilServiceEligibilities = await CivilServiceEligibility.findAll({ where: { EmployeeID: employeeId } });
    if (civilServiceEligibilities.length > 0) {
      res.status(200).json(civilServiceEligibilities);
    } else {
      res.status(404).send('No Civil Service Eligibility records found for this employee');
    }
  } catch (error) {
    console.error('Error getting civil service eligibilities:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteCivilServiceEligibility = async (req, res) => {
  try {
    const eligibilityId = req.params.id;
    const result = await CivilServiceEligibility.destroy({
      where: { CivilServiceEligibilityID: eligibilityId, EmployeeID: req.user.userId }
    });
    if (result === 0) {
      res.status(404).send('Civil Service Eligibility record not found');
    } else {
      res.status(204).send();
    }
  } catch (error) {
    console.error('Error deleting civil service eligibility:', error);
    res.status(500).send('Internal Server Error');
  }
};