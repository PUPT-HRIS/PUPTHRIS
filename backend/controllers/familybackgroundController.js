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

exports.updateFamilyBackground = async (req, res) => {
  try {
    const backgroundId = req.params.id;
    const updatedData = req.body;
    const result = await FamilyBackground.update(updatedData, {
      where: { FamilyBackgroundID: backgroundId }
    });
    if (result[0] === 0) {
      res.status(404).send('Family Background record not found');
    } else {
      res.status(200).send('Family Background updated successfully');
    }
  } catch (err) {
    console.error('Error updating family background:', err);
    res.status(500).send('Internal Server Error');
  }
};