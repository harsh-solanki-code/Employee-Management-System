const mongoose = require('mongoose');

const employeeFields = new Set([
  'employee_code',
  'first_name',
  'last_name',
  'email',
  'mobile_no',
  'department',
  'designation',
  'joining_date',
  'salary',
  'employee_status'
]);

const requiredFields = [
  'employee_code',
  'first_name',
  'last_name',
  'email',
  'mobile_no',
  'department',
  'designation',
  'joining_date',
  'salary'
];

const sortableFields = new Set([
  'name',
  'employee_code',
  'first_name',
  'last_name',
  'email',
  'department',
  'designation',
  'joining_date',
  'salary',
  'employee_status',
  'createdAt',
  'updatedAt'
]);

function sendValidationError(res, details) {
  return res.status(400).json({
    success: false,
    message: details[0] || 'Validation failed',
    details
  });
}

function validateEmployeeBody({ partial = false } = {}) {
  return (req, res, next) => {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return sendValidationError(res, ['Request body must be a JSON object']);
    }

    const body = req.body;
    const errors = [];
    const validated = {};

    for (const key of Object.keys(body)) {
      if (!employeeFields.has(key)) {
        errors.push(`Unknown field: ${key}`);
      }
    }

    if (partial && Object.keys(body).length === 0) {
      errors.push('At least one field is required for update');
    }

    if (!partial) {
      for (const field of requiredFields) {
        if (body[field] === undefined || body[field] === null || String(body[field]).trim() === '') {
          errors.push(`${field} is required`);
        }
      }
    }

    for (const [field, value] of Object.entries(body)) {
      if (!employeeFields.has(field)) {
        continue;
      }

      if (['first_name', 'last_name', 'department', 'designation'].includes(field)) {
        if (typeof value !== 'string' || !value.trim()) {
          errors.push(`${field} must be a non-empty string`);
        } else {
          validated[field] = value.trim();
        }
        continue;
      }

      if (field === 'employee_code') {
        if (typeof value !== 'string' || !value.trim()) {
          errors.push('employee_code must be a non-empty string');
        } else {
          validated.employee_code = value.trim().toUpperCase();
        }
        continue;
      }

      if (field === 'email') {
        if (typeof value !== 'string' || !value.trim()) {
          errors.push('email must be a valid email address');
        } else {
          const email = value.trim().toLowerCase();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push('Please enter a valid email address');
          } else {
            validated.email = email;
          }
        }
        continue;
      }

      if (field === 'mobile_no') {
        const mobile = String(value).trim();
        if (!/^\d{10}$/.test(mobile)) {
          errors.push('mobile_no must be a 10-digit number');
        } else {
          validated.mobile_no = mobile;
        }
        continue;
      }

      if (field === 'salary') {
        const numSalary = typeof value === 'number' ? value : Number(value);
        if (value === '' || !Number.isFinite(numSalary) || numSalary < 0) {
          errors.push('salary must be a valid non-negative number');
        } else {
          validated.salary = numSalary;
        }
        continue;
      }

      if (field === 'joining_date') {
        if (typeof value !== 'string' || !value.trim() || Number.isNaN(Date.parse(value))) {
          errors.push('joining_date must be a valid date');
        } else {
          validated.joining_date = new Date(value);
        }
        continue;
      }

      if (field === 'employee_status') {
        const status = typeof value === 'string' ? value.trim().toLowerCase() : '';
        if (!['active', 'inactive'].includes(status)) {
          errors.push('employee_status must be active or inactive');
        } else {
          validated.employee_status = status;
        }
      }
    }

    if (errors.length > 0) {
      return sendValidationError(res, errors);
    }

    if (!partial && !validated.employee_status) {
      validated.employee_status = 'active';
    }

    req.validatedEmployee = validated;
    next();
  };
}

function validateEmployeeQuery(req, res, next) {
  const { search, department, status, employee_status, page, limit, sortBy, sortOrder } = req.query;
  const errors = [];

  const parsedPage = page === undefined ? 1 : Number(page);
  const parsedLimit = limit === undefined ? 10 : Number(limit);
  const effectiveStatus = status !== undefined ? status : employee_status;
  const effectiveSortBy = sortBy || 'createdAt';
  const effectiveSortOrder = (sortOrder || 'desc').toLowerCase();

  if (!Number.isInteger(parsedPage) || parsedPage < 1) {
    errors.push('page must be a positive integer');
  }

  if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 50) {
    errors.push('limit must be an integer between 1 and 50');
  }

  if (effectiveStatus !== undefined && effectiveStatus !== '' && !['active', 'inactive'].includes(String(effectiveStatus).toLowerCase())) {
    errors.push('status must be active or inactive');
  }

  if (!sortableFields.has(effectiveSortBy)) {
    errors.push(`sortBy must be one of: ${Array.from(sortableFields).join(', ')}`);
  }

  if (!['asc', 'desc'].includes(effectiveSortOrder)) {
    errors.push('sortOrder must be asc or desc');
  }

  if (errors.length > 0) {
    return sendValidationError(res, errors);
  }

  req.employeeQuery = {
    search: typeof search === 'string' && search.trim() ? search.trim() : '',
    department: typeof department === 'string' && department.trim() ? department.trim() : '',
    status: effectiveStatus ? String(effectiveStatus).trim().toLowerCase() : '',
    page: parsedPage,
    limit: parsedLimit,
    sortBy: effectiveSortBy,
    sortOrder: effectiveSortOrder
  };

  next();
}

function validateEmployeeId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid employee ID'
    });
  }
  next();
}

module.exports = {
  validateEmployeeBody,
  validateEmployeeQuery,
  validateEmployeeId
};
