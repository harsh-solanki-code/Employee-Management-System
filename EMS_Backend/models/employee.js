const mongoose = require('mongoose');
const { COMPANY_IDS } = require('../config/companies');

const employeeSchema = new mongoose.Schema(
  {
    company_id: {
      type: String,
      required: [true, 'Company ID is required'],
      enum: COMPANY_IDS,
      trim: true
    },
    employee_code: {
      type: String,
      required: [true, 'Employee code is required'],
      trim: true,
      uppercase: true
    },
    first_name: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    last_name: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    },
    mobile_no: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
      match: [/^\d{10}$/, 'Mobile number must be 10 digits']
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true
    },
    joining_date: {
      type: Date,
      required: [true, 'Joining date is required']
    },
    salary: {
      type: Number,
      required: [true, 'Salary is required'],
      min: [0, 'Salary must be a positive number']
    },
    employee_status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

employeeSchema.index({ company_id: 1, employee_code: 1 }, { unique: true });
employeeSchema.index({ company_id: 1, email: 1 }, { unique: true });
employeeSchema.index({ company_id: 1, department: 1, employee_status: 1 });
employeeSchema.index({ company_id: 1, first_name: 1, last_name: 1 });
employeeSchema.index({ company_id: 1, createdAt: -1 });

module.exports = mongoose.model('Employee', employeeSchema);
