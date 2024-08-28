const OfficershipMembership = require('../models/officerMembershipModel');

exports.addOfficershipMembership = async (req, res) => {
  try {
    const newMembership = await OfficershipMembership.create(req.body);
    res.status(201).json(newMembership);
  } catch (error) {
    console.error('Error adding officership/membership:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.updateOfficershipMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const [updated] = await OfficershipMembership.update(updates, {
      where: { OfficershipMembershipID: id }
    });
    if (updated) {
      const updatedMembership = await OfficershipMembership.findOne({ where: { OfficershipMembershipID: id } });
      res.status(200).json({ membership: updatedMembership });
    } else {
      res.status(404).send('Officership/Membership not found');
    }
  } catch (err) {
    console.error('Error updating officership/membership:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.getOfficershipMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const membership = await OfficershipMembership.findOne({ where: { OfficershipMembershipID: id } });
    if (membership) {
      res.status(200).json(membership);
    } else {
      res.status(404).send('Officership/Membership not found');
    }
  } catch (error) {
    console.error('Error getting officership/membership:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getOfficershipMembershipsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const memberships = await OfficershipMembership.findAll({ where: { UserID: userId } });
    if (memberships.length > 0) {
      res.status(200).json(memberships);
    } else {
      res.status(404).send('No officership/membership records found for this user');
    }
  } catch (error) {
    console.error('Error getting officership/memberships:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteOfficershipMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await OfficershipMembership.destroy({ where: { OfficershipMembershipID: id } });
    if (result) {
      res.status(200).json({ message: 'Officership/Membership record deleted successfully' });
    } else {
      res.status(404).json({ error: 'Officership/Membership record not found' });
    }
  } catch (error) {
    console.error('Error deleting officership/membership:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
