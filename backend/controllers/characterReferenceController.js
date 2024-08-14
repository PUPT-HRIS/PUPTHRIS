const CharacterReference = require('../models/characterReferenceModel');

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
    const userId = req.params.id;
    const characterReferences = await CharacterReference.findAll({ where: { UserID: userId } });
    if (characterReferences) {
      res.status(200).json(characterReferences);
    } else {
      res.status(404).send('No references found for this user');
    }
  } catch (error) {
    console.error('Error fetching character references:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteCharacterReference = async (req, res) => {
  try {
    const referenceId = req.params.id;
    const result = await CharacterReference.destroy({
      where: { ReferenceID: referenceId }
    });

    if (result) {
      res.status(200).json({ message: 'Character reference deleted successfully' });
    } else {
      res.status(404).json({ message: 'Character reference not found' });
    }
  } catch (error) {
    console.error('Error deleting character reference:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


