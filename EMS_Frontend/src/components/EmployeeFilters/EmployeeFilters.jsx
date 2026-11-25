import { DEPARTMENTS } from '../../constants';

function EmployeeFilters({
  searchInput,
  onSearchChange,
  department,
  onDepartmentChange,
  status,
  onStatusChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onReset,
  onAddClick
}) {
  return (
    <div className="toolbar">
      <div className="filters-row">
        <input
          type="text"
          className="filter-input search-input"
          placeholder="Search by employee name or code..."
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <select
          className="filter-select"
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
        >
          <option value="createdAt">Sort: Created Date</option>
          <option value="name">Sort: Name</option>
          <option value="employee_code">Sort: Employee Code</option>
          <option value="salary">Sort: Salary</option>
          <option value="joining_date">Sort: Joining Date</option>
        </select>

        <select
          className="filter-select"
          value={sortOrder}
          onChange={(e) => onSortOrderChange(e.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>

        <button type="button" className="btn btn-secondary" onClick={onReset}>
          Reset
        </button>
      </div>

      <button type="button" className="btn btn-primary" onClick={onAddClick}>
        + Add Employee
      </button>
    </div>
  );
}

export default EmployeeFilters;

