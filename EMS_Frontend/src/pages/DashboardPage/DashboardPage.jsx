import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AlertMessage from '../../components/AlertMessage/AlertMessage';
import DeleteConfirmModal from '../../components/DeleteConfirmModal/DeleteConfirmModal';
import EmployeeFilters from '../../components/EmployeeFilters/EmployeeFilters';
import EmployeeFormModal from '../../components/EmployeeFormModal/EmployeeFormModal';
import EmployeeTable from '../../components/EmployeeTable/EmployeeTable';
import Navbar from '../../components/Navbar/Navbar';
import Pagination from '../../components/Pagination/Pagination';
import { logout } from '../../store/slices/authSlice';
import {
  addEmployee,
  clearFormError,
  clearMessages,
  editEmployee,
  fetchEmployees,
  removeEmployee,
  resetEmployeeState,
  resetFilters,
  setFilters
} from '../../store/slices/employeeSlice';

function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const {
    list: employees,
    pagination,
    filters,
    loading,
    submitting,
    deleting,
    error,
    formError,
    successMessage
  } = useSelector((state) => state.employees);

  const [searchInput, setSearchInput] = useState(filters.search);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        dispatch(setFilters({ search: searchInput, page: 1 }));
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, filters.search, dispatch]);

  useEffect(() => {
    const params = {
      page: filters.page,
      limit: filters.limit,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder
    };
    if (filters.search) {
      params.search = filters.search;
    }
    if (filters.department) {
      params.department = filters.department;
    }
    if (filters.status) {
      params.status = filters.status;
    }

    dispatch(fetchEmployees(params));
  }, [filters, dispatch]);

  function reloadList(customPage) {
    const targetPage = customPage ?? filters.page;
    const params = {
      page: targetPage,
      limit: filters.limit,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder
    };
    if (filters.search) {
      params.search = filters.search;
    }
    if (filters.department) {
      params.department = filters.department;
    }
    if (filters.status) {
      params.status = filters.status;
    }
    dispatch(fetchEmployees(params));
  }

  function handleLogout() {
    dispatch(logout());
    dispatch(resetEmployeeState());
    navigate('/login', { replace: true });
  }

  function handleResetFilters() {
    setSearchInput('');
    dispatch(resetFilters());
  }

  function openAddModal() {
    setEditingEmployee(null);
    dispatch(clearFormError());
    setFormOpen(true);
  }

  function openEditModal(employee) {
    setEditingEmployee(employee);
    dispatch(clearFormError());
    setFormOpen(true);
  }

  async function handleFormSubmit(payload) {
    if (submitting) {
      return;
    }

    const result = editingEmployee
      ? await dispatch(editEmployee({ id: editingEmployee._id, payload }))
      : await dispatch(addEmployee(payload));

    if (!result.error) {
      setFormOpen(false);
      setEditingEmployee(null);
      reloadList();
    }
  }

  async function handleConfirmDelete() {
    if (!deletingEmployee || deleting) {
      return;
    }

    const result = await dispatch(removeEmployee(deletingEmployee._id));
    setDeletingEmployee(null);

    if (!result.error) {
      if (employees.length === 1 && filters.page > 1) {
        dispatch(setFilters({ page: filters.page - 1 }));
      } else {
        reloadList();
      }
    }
  }

  return (
    <div className="app-shell">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="main-container">
        <div className="page-header">
          <div>
            <h2>Employees</h2>
            <p className="page-subtitle">
              Manage employee records for {user.company_name || user.company_id}
            </p>
          </div>
        </div>

        <AlertMessage
          type={error ? 'error' : 'success'}
          message={error || successMessage}
          onClose={() => dispatch(clearMessages())}
        />

        <div className="card">
          <EmployeeFilters
            searchInput={searchInput}
            onSearchChange={setSearchInput}
            department={filters.department}
            onDepartmentChange={(department) => dispatch(setFilters({ department, page: 1 }))}
            status={filters.status}
            onStatusChange={(status) => dispatch(setFilters({ status, page: 1 }))}
            sortBy={filters.sortBy}
            onSortByChange={(sortBy) => dispatch(setFilters({ sortBy, page: 1 }))}
            sortOrder={filters.sortOrder}
            onSortOrderChange={(sortOrder) => dispatch(setFilters({ sortOrder, page: 1 }))}
            onReset={handleResetFilters}
            onAddClick={openAddModal}
          />

          <EmployeeTable
            employees={employees}
            loading={loading}
            onEdit={openEditModal}
            onDelete={setDeletingEmployee}
          />

          <Pagination
            page={filters.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={filters.limit}
            onPageChange={(page) => dispatch(setFilters({ page }))}
            onLimitChange={(limit) => dispatch(setFilters({ limit, page: 1 }))}
          />
        </div>
      </main>

      <EmployeeFormModal
        isOpen={formOpen}
        employee={editingEmployee}
        submitting={submitting}
        apiError={formError}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmModal
        employee={deletingEmployee}
        deleting={deleting}
        onCancel={() => setDeletingEmployee(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default DashboardPage;

