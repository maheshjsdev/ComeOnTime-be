const jwt = require('jsonwebtoken');

exports.generateToken = (req, res) => {
  const { userId, password } = req.body;
  if (!userId || !password) return res.status(400).json({ status: false, message: 'userId and password required' });

  const User = require('../models/user.model');
  User.findOne({ userId })
    .then(user => {
      if (!user || user.password !== password) {
        return res.status(401).json({ status: false, message: 'Invalid credentials' });
      }
      const token = jwt.sign({ userId: user.userId, role: user.userRole }, process.env.JWT_SECRET || 'defaultsecret', {
        expiresIn: '1d'
      });
      res.status(200).json({ status: true, token, roleId: user.userRole });
    })
    .catch(err => {
      res.status(500).json({ status: false, message: err.message });
    });
};
