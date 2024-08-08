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

exports.getChildrenByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const children = await Children.findAll({ where: { EmployeeID: employeeId } });
    if (children.length > 0) {
      res.status(200).json(children);
    } else {
      res.status(404).send('No children found for this employee');
    }
  } catch (error) {
    console.error('Error getting children:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteChild = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Children.destroy({ where: { ChildrenID: id } });
    if (result) {
      res.status(200).json({ message: 'Child deleted successfully' });
    } else {
      res.status(404).json({ error: 'Child not found' });
    }
  } catch (error) {
    console.error('Error deleting child:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
