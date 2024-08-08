const Membership = require('../models/membershipModel');

exports.addMembership = async (req, res) => {
  try {
    const newMembership = await Membership.create(req.body);
    res.status(201).json(newMembership);
  } catch (error) {
    console.error('Error adding membership:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.updateMembership = async (req, res) => {
  try {
    const membershipId = req.params.id;
    const updatedData = req.body;
    console.log('Received data for update:', updatedData);
    const result = await Membership.update(updatedData, {
      where: { MembershipID: membershipId }
    });
    if (result[0] === 0) {
      res.status(404).json({ message: 'Membership record not found' });
    } else {
      res.status(200).json({ message: 'Membership updated successfully' });
    }
  } catch (err) {
    console.error('Error updating membership:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getMembershipsByEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const memberships = await Membership.findAll({ where: { EmployeeID: employeeId } });
    res.status(200).json(memberships);
  } catch (error) {
    console.error('Error fetching memberships:', error);
    res.status(500).send('Internal Server Error');
  }
};
