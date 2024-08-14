const ContactDetails = require('../models/contactDetailsModel');

exports.addContactDetails = async (req, res) => {
  try {
    const newContactDetails = await ContactDetails.create(req.body);
    res.status(201).json(newContactDetails);
  } catch (error) {
    console.error('Error adding contact details:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.updateContactDetails = async (req, res) => {
  try {
    const contactDetailsId = req.params.id;
    const updatedData = req.body;
    const result = await ContactDetails.update(updatedData, {
      where: { ContactDetailsID: contactDetailsId }
    });
    if (result[0] === 0) {
      res.status(404).json({ message: 'Contact details record not found' });
    } else {
      const updatedContactDetails = await ContactDetails.findOne({ where: { ContactDetailsID: contactDetailsId } });
      res.status(200).json(updatedContactDetails);
    }
  } catch (error) {
    console.error('Error updating contact details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getContactDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    const contactDetails = await ContactDetails.findOne({ where: { UserID: userId } });
    if (contactDetails) {
      res.status(200).json(contactDetails);
    } else {
      res.status(404).send('Contact details record not found');
    }
  } catch (error) {
    console.error('Error getting contact details:', error);
    res.status(500).send('Internal Server Error');
  }
};
