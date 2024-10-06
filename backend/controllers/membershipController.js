const Membership = require('../models/membershipModel');

exports.addMembership = async (req, res) => {
  try {
    const newMembership = await Membership.create({
      ...req.body,
      userID: req.user.userId
    });
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
    const result = await Membership.update(updatedData, {
      where: { MembershipID: membershipId, userID: req.user.userId }
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

exports.getMembershipsByUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const memberships = await Membership.findAll({ where: { userID: userId } });
    res.status(200).json(memberships);
  } catch (error) {
    console.error('Error fetching memberships:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteMembership = async (req, res) => {
  try {
    const membershipId = req.params.id;
    const result = await Membership.destroy({
      where: { MembershipID: membershipId, userID: req.user.userId }
    });
    if (result === 0) {
      res.status(404).json({ error: 'Membership record not found' });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    console.error('Error deleting membership:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
