const UserSignatures = require('../models/UserSignatures');

exports.addUserSignature = async (req, res) => {
  try {
    const newUserSignature = await UserSignatures.create(req.body);
    res.status(201).json(newUserSignature);
  } catch (error) {
    console.error('Error adding user signature:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.updateUserSignature = async (req, res) => {
  try {
    const signatureId = req.params.id;
    const updatedData = req.body;
    const result = await UserSignatures.update(updatedData, {
      where: { SignatureID: signatureId }
    });
    if (result[0] === 0) {
      res.status(404).json({ message: 'User signature record not found' });
    } else {
      const updatedUserSignature = await UserSignatures.findOne({ where: { SignatureID: signatureId } });
      res.status(200).json(updatedUserSignature);
    }
  } catch (error) {
    console.error('Error updating user signature:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getUserSignature = async (req, res) => {
  try {
    const signatureId = req.params.id;
    const userSignature = await UserSignatures.findOne({ where: { SignatureID: signatureId } });
    if (userSignature) {
      res.status(200).json(userSignature);
    } else {
      res.status(404).send('User signature record not found');
    }
  } catch (error) {
    console.error('Error getting user signature:', error);
    res.status(500).send('Internal Server Error');
  }
};
