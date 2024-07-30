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

exports.updateChild = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const [updated] = await Children.update(updates, {
      where: { ChildrenID: id }
    });
    if (updated) {
      const updatedChild = await Children.findOne({ where: { ChildrenID: id } });
      res.status(200).json({ child: updatedChild });
    } else {
      res.status(404).send('Child not found');
    }
  } catch (err) {
    console.error('Error updating child:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.getChild = async (req, res) => {
  try {
    const { id } = req.params;
    const child = await Children.findOne({ where: { ChildrenID: id } });
    if (child) {
      res.status(200).json(child);
    } else {
      res.status(404).send('Child not found');
    }
  } catch (error) {
    console.error('Error getting child:', error);
    res.status(500).send('Internal Server Error');
  }
};