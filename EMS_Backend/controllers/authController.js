const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { COMPANIES, COMPANY_IDS } = require('../config/companies');

function generateToken(user) {
  const secret = process.env.JWT_SECRET || 'ems_secret_key_2026';
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      company_id: user.company_id,
      role: user.role || 'user'
    },
    secret,
    { expiresIn: '1d' }
  );
}

function getCompanyName(companyId) {
  const found = COMPANIES.find((item) => item.id === companyId);
  return found ? found.name : companyId;
}

function getCompanies(req, res) {
  return res.json({
    success: true,
    data: COMPANIES
  });
}

async function register(req, res, next) {
  try {
    const { name, email, password, company_id, role } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Valid email is required' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    if (!company_id || !COMPANY_IDS.includes(company_id)) {
      return res.status(400).json({ success: false, message: 'Please select a valid company' });
    }

    const userRole = role === 'admin' ? 'admin' : 'user';
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      company_id,
      role: userRole
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        company_id: user.company_id,
        company_name: getCompanyName(user.company_id),
        role: user.role
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Valid email is required' });
    }
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ success: false, message: 'Password is required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        company_id: user.company_id,
        company_name: getCompanyName(user.company_id),
        role: user.role || 'user'
      }
    });
  } catch (error) {
    return next(error);
  }
}

function getMe(req, res) {
  return res.json({
    success: true,
    user: {
      ...req.user,
      company_name: getCompanyName(req.user.company_id)
    }
  });
}

module.exports = {
  getCompanies,
  register,
  login,
  getMe
};

