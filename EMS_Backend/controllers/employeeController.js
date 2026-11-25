const Employee = require('../models/employee');

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildSearchCondition(search) {
  const regex = new RegExp(escapeRegex(search), 'i');
  const terms = search.split(/\s+/).filter(Boolean);

  if (terms.length >= 2) {
    const firstRegex = new RegExp(escapeRegex(terms[0]), 'i');
    const lastRegex = new RegExp(escapeRegex(terms.slice(1).join(' ')), 'i');
    return {
      $or: [
        { first_name: regex },
        { last_name: regex },
        { employee_code: regex },
        { $and: [{ first_name: firstRegex }, { last_name: lastRegex }] }
      ]
    };
  }

  return {
    $or: [
      { first_name: regex },
      { last_name: regex },
      { employee_code: regex }
    ]
  };
}

async function createEmployee(req, res, next) {
  try {
    const companyId = req.user.company_id;
    const { employee_code, email } = req.validatedEmployee;

    const existingEmployee = await Employee.findOne({
      company_id: companyId,
      $or: [{ employee_code }, { email }]
    }).lean();

    if (existingEmployee) {
      const message = existingEmployee.employee_code === employee_code
        ? 'An employee with this employee code already exists in your company'
        : 'An employee with this email already exists in your company';
      return res.status(409).json({ success: false, message });
    }

    const employee = await Employee.create({
      ...req.validatedEmployee,
      company_id: companyId
    });

    return res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });
  } catch (error) {
    return next(error);
  }
}

async function listEmployees(req, res, next) {
  try {
    const companyId = req.user.company_id;
    const { search, department, status, page, limit, sortBy, sortOrder } = req.employeeQuery;

    const filter = { company_id: companyId };

    if (search) {
      Object.assign(filter, buildSearchCondition(search));
    }

    if (department) {
      filter.department = department;
    }

    if (status) {
      filter.employee_status = status;
    }

    const direction = sortOrder === 'asc' ? 1 : -1;
    const sort = sortBy === 'name'
      ? { first_name: direction, last_name: direction }
      : { [sortBy]: direction };

    const skip = (page - 1) * limit;

    const [employees, total] = await Promise.all([
      Employee.find(filter)
        .select('-__v')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Employee.countDocuments(filter)
    ]);

    return res.json({
      success: true,
      data: employees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function getEmployee(req, res, next) {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      company_id: req.user.company_id
    })
      .select('-__v')
      .lean();

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    return res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    return next(error);
  }
}

async function updateEmployee(req, res, next) {
  try {
    const companyId = req.user.company_id;
    const { employee_code, email } = req.validatedEmployee;
    const duplicateChecks = [];

    if (employee_code) {
      duplicateChecks.push({ employee_code });
    }
    if (email) {
      duplicateChecks.push({ email });
    }

    if (duplicateChecks.length > 0) {
      const existingEmployee = await Employee.findOne({
        _id: { $ne: req.params.id },
        company_id: companyId,
        $or: duplicateChecks
      }).lean();

      if (existingEmployee) {
        const message = existingEmployee.employee_code === employee_code
          ? 'An employee with this employee code already exists in your company'
          : 'An employee with this email already exists in your company';
        return res.status(409).json({ success: false, message });
      }
    }

    const employee = await Employee.findOneAndUpdate(
      { _id: req.params.id, company_id: companyId },
      { $set: req.validatedEmployee },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    return res.json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteEmployee(req, res, next) {
  try {
    const employee = await Employee.findOneAndDelete({
      _id: req.params.id,
      company_id: req.user.company_id
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    return res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createEmployee,
  listEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee
};
