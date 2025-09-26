const mongoose = require('mongoose');
require('dotenv').config();
const Role = require('../models/role.model');

const roles = [
  { roleId: '1', roleName: 'superAdmin' },
  { roleId: '2', roleName: 'admin' },
  { roleId: '3', roleName: 'user' }
];

async function seedRoles() {
  await mongoose.connect(process.env.MONGODB_URI_PROD || process.env.MONGODB_URI_DEV || process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  for (const role of roles) {
    const exists = await Role.findOne({ roleId: role.roleId });
    if (!exists) {
      await Role.create(role);
      console.log(`Role created: ${role.roleName}`);
    } else {
      console.log(`Role already exists: ${role.roleName}`);
    }
  }

  mongoose.disconnect();
}

seedRoles();
