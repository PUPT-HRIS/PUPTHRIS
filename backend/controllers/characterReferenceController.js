const CharacterReference = require('../models/CharacterReference');

exports.addCharacterReference = async (req, res) => {
  try {
    const newCharacterReference = await CharacterReference.create(req.body);
    res.status(201).json(newCharacterReference);
  } catch (error) {
    console.error('Error adding character reference:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.updateCharacterReference = async (req, res) => {
  try {
    const referenceId = req.params.id;
    const updatedData = req.body;
    const result = await CharacterReference.update(updatedData, {
      where: { ReferenceID: referenceId }
    });
    if (result[0] === 0) {
      res.status(404).json({ message: 'Character reference record not found' });
    } else {
      const updatedCharacterReference = await CharacterReference.findOne({ where: { ReferenceID: referenceId } });
      res.status(200).json(updatedCharacterReference);
    }
  } catch (error) {
    console.error('Error updating character reference:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getCharacterReference = async (req, res) => {
  try {
    const referenceId = req.params.id;
    const characterReference = await CharacterReference.findOne({ where: { ReferenceID: referenceId } });
    if (characterReference) {
      res.status(200).json(characterReference);
    } else {
      res.status(404).send('Character reference record not found');
    }
  } catch (error) {
    console.error('Error getting character reference:', error);
    res.status(500).send('Internal Server Error');
  }
};
