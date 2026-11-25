function formatDate(dateString) {
  if (!dateString) {
    return '-';
  }
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
}

function formatSalary(salary) {
  if (salary === undefined || salary === null) {
    return '-';
  }
  return Number(salary).toLocaleString('en-IN');
}

function EmployeeTable({ employees, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="table-state">
        <div className="spinner" />
        <p>Loading employees...</p>
      </div>
    );
  }

  if (!employees || employees.length === 0) {
    return (
      <div className="table-state">
        <p>No employees found. Try adjusting filters or add a new employee.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Joining Date</th>
            <th>Salary</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td className="code-cell">{employee.employee_code}</td>
              <td>{employee.first_name} {employee.last_name}</td>
              <td>{employee.email}</td>
              <td>{employee.mobile_no}</td>
              <td>{employee.department}</td>
              <td>{employee.designation}</td>
              <td>{formatDate(employee.joining_date)}</td>
              <td>{formatSalary(employee.salary)}</td>
              <td>
                <span className={`status-badge status-${employee.employee_status}`}>
                  {employee.employee_status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => onEdit(employee)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(employee)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeTable;

