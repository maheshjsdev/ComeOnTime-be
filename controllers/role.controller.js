const Role = require('../models/role.model');

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createRole = async (req, res) => {
  try {
    const { roleName } = req.body;

    if (!roleName || roleName.trim() === "") {
      return res.status(400).json({
        status: false,
        message: "roleName is required"
      });
    }

    // Find the max roleId and increment
    const lastRole = await Role.findOne().sort({ roleId: -1 });
    const nextId = lastRole ? (parseInt(lastRole.roleId) + 1).toString() : "1";

    // Create and save new role
    const newRole = new Role({ roleId: nextId, roleName });
    await newRole.save();

    res.status(201).json({
      status: true,
      message: "Role created successfully",
      data: newRole
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
};


exports.deleteRole = async (req, res) => {
  try {
    const { roleId } = req.body;
    const deletedRole = await Role.findOneAndDelete({ roleId });
    if (!deletedRole) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.json({ message: 'Role deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { roleId, roleName } = req.body;
    const updatedRole = await Role.findOneAndUpdate({ roleId }, { roleName }, { new: true });
    if (!updatedRole) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.json(updatedRole);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
