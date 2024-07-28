const Children = require('../models/childrenModel');

exports.addChild = async (req, res) => {
  try {
    const newChild = await Children.create(req.body);
    res.status(201).json(newChild);
  } catch (error) {
    console.error('Error adding child:', error);
    res.status(500).send('Internal Server Error');
  }
};
