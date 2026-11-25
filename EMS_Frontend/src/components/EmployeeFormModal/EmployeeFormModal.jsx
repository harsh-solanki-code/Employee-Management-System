import { useEffect, useState } from 'react';
import { DEPARTMENTS } from '../../constants';
import AlertMessage from '../AlertMessage/AlertMessage';

const INITIAL_FORM = {
  employee_code: '',
  first_name: '',
  last_name: '',
  email: '',
  mobile_no: '',
  department: 'Engineering',
  designation: '',
  joining_date: '',
  salary: '',
  employee_status: 'active'
};

function toDateInputValue(dateValue) {
  if (!dateValue) {
    return '';
  }
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toISOString().split('T')[0];
}

function EmployeeFormModal({ isOpen, employee, submitting, apiError, onClose, onSubmit }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee) {
      setFormData({
        employee_code: employee.employee_code || '',
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        email: employee.email || '',
        mobile_no: employee.mobile_no || '',
        department: employee.department || 'Engineering',
        designation: employee.designation || '',
        joining_date: toDateInputValue(employee.joining_date),
        salary: employee.salary !== undefined ? String(employee.salary) : '',
        employee_status: employee.employee_status || 'active'
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setErrors({});
  }, [employee, isOpen]);

  if (!isOpen) {
    return null;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const nextErrors = {};

    if (!formData.employee_code.trim()) {
      nextErrors.employee_code = 'Employee code is required';
    }
    if (!formData.first_name.trim()) {
      nextErrors.first_name = 'First name is required';
    }
    if (!formData.last_name.trim()) {
      nextErrors.last_name = 'Last name is required';
    }
    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = 'Please enter a valid email address';
    }
    if (!formData.mobile_no.trim()) {
      nextErrors.mobile_no = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile_no.trim())) {
      nextErrors.mobile_no = 'Mobile number must be 10 digits';
    }
    if (!formData.department.trim()) {
      nextErrors.department = 'Department is required';
    }
    if (!formData.designation.trim()) {
      nextErrors.designation = 'Designation is required';
    }
    if (!formData.joining_date) {
      nextErrors.joining_date = 'Joining date is required';
    }
    if (formData.salary === '' || Number.isNaN(Number(formData.salary)) || Number(formData.salary) < 0) {
      nextErrors.salary = 'Salary must be a non-negative number';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (submitting || !validate()) {
      return;
    }

    onSubmit({
      employee_code: formData.employee_code.trim().toUpperCase(),
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email.trim().toLowerCase(),
      mobile_no: formData.mobile_no.trim(),
      department: formData.department.trim(),
      designation: formData.designation.trim(),
      joining_date: formData.joining_date,
      salary: Number(formData.salary),
      employee_status: formData.employee_status
    });
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card modal-lg">
        <div className="modal-header">
          <h3>{employee ? 'Edit Employee' : 'Add New Employee'}</h3>
          <button type="button" className="modal-close" onClick={onClose} disabled={submitting}>
            ×
          </button>
        </div>

        <AlertMessage type="error" message={apiError} />

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="employee_code">Employee Code</label>
              <input
                id="employee_code"
                name="employee_code"
                type="text"
                value={formData.employee_code}
                onChange={handleChange}
                placeholder="e.g. EMP001"
              />
              {errors.employee_code && <span className="field-error">{errors.employee_code}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="employee_status">Status</label>
              <select
                id="employee_status"
                name="employee_status"
                value={formData.employee_status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter first name"
              />
              {errors.first_name && <span className="field-error">{errors.first_name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter last name"
              />
              {errors.last_name && <span className="field-error">{errors.last_name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="employee@company.com"
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="mobile_no">Mobile Number</label>
              <input
                id="mobile_no"
                name="mobile_no"
                type="text"
                maxLength={10}
                value={formData.mobile_no}
                onChange={handleChange}
                placeholder="10-digit mobile number"
              />
              {errors.mobile_no && <span className="field-error">{errors.mobile_no}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="department">Department</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && <span className="field-error">{errors.department}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="designation">Designation</label>
              <input
                id="designation"
                name="designation"
                type="text"
                value={formData.designation}
                onChange={handleChange}
                placeholder="e.g. Software Developer"
              />
              {errors.designation && <span className="field-error">{errors.designation}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="joining_date">Joining Date</label>
              <input
                id="joining_date"
                name="joining_date"
                type="date"
                value={formData.joining_date}
                onChange={handleChange}
              />
              {errors.joining_date && <span className="field-error">{errors.joining_date}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="salary">Salary</label>
              <input
                id="salary"
                name="salary"
                type="number"
                min="0"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. 50000"
              />
              {errors.salary && <span className="field-error">{errors.salary}</span>}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : employee ? 'Update Employee' : 'Save Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeFormModal;

