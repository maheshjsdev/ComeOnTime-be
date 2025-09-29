require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
const authMiddleware = require('./middleware/auth.middleware');

// Connect to MongoDB
connectDB();

// Routes
app.use('/auth', require('./routes/auth.routes'));
app.use('/users', require('./routes/user.routes'));
app.use('/admin', require('./routes/admin.routes'));
app.use('/superadmin', require('./routes/superadmin.routes'));
app.use('/dashboard', require('./routes/dashboard.routes'));
app.use('/attendance', require('./routes/attendance.routes'));
app.use('/roles', require('./routes/role.routes'));
app.use('/token', require('./routes/token.routes'));
app.use('/designation', require('./routes/designation.routes'));

const PORT = process.env.PORT || 4321;
app.listen(PORT, () => {
  console.log(`port: http://localhost:${PORT}/`);
});
