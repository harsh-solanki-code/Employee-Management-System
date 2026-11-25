const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access. Token is required.'
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'ems_secret_key_2026';
    const decoded = jwt.verify(token, secret);

    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      company_id: decoded.company_id,
      role: decoded.role || 'user'
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access. Invalid or expired token.'
    });
  }
}

module.exports = authMiddleware;

