const jwt = require('jsonwebtoken');

exports.generateToken = (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required' });

  const token = jwt.sign({ userId }, process.env.JWT_SECRET || 'defaultsecret', {
    expiresIn: '5m'
  });
  res.json({ token });
};
