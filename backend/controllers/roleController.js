// roleController.js
const Role = require('../models/roleModel');

exports.addRole = async (req, res) => {
  try {
    const { RoleName } = req.body;
    const newRole = await Role.create({ RoleName });
    res.status(201).json(newRole);
  } catch (error) {
    console.error('Error adding role:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { RoleName } = req.body;
    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).send('Role not found');
    }

    role.RoleName = RoleName;
    await role.save();

    res.status(200).json(role);
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).send('Role not found');
    }

    await role.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).send('Internal Server Error');
  }
};
