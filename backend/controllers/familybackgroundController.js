const FamilyBackground = require('../models/familybackgroundModel');

exports.addFamilyBackground = async (req, res) => {
  try {
    const newFamilyBackground = await FamilyBackground.create(req.body);
    res.status(201).json(newFamilyBackground);
  } catch (error) {
    console.error('Error adding family background:', error);
    res.status(500).send('Internal Server Error');
  }
};
