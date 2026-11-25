function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.code === 11000) {
    const keys = Object.keys(error.keyPattern || error.keyValue || {});
    let message = 'Duplicate record already exists';

    if (keys.includes('employee_code')) {
      message = 'An employee with this employee code already exists in your company';
    } else if (keys.includes('email')) {
      message = 'An employee with this email already exists';
    }

    return res.status(409).json({
      success: false,
      message
    });
  }

  if (error.name === 'ValidationError') {
    const details = Object.values(error.errors).map((item) => item.message);
    return res.status(400).json({
      success: false,
      message: details[0] || 'Validation failed',
      details
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access. Invalid or expired token.'
    });
  }

  if (error.statusCode) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
  }

  console.error('Server error:', error);
  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
}

module.exports = errorHandler;
