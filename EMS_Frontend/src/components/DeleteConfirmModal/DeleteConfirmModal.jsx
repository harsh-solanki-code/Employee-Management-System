function DeleteConfirmModal({ employee, deleting, onCancel, onConfirm }) {
  if (!employee) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card modal-sm">
        <div className="modal-header">
          <h3>Confirm Delete</h3>
        </div>
        <p className="confirm-text">
          Are you sure you want to delete{' '}
          <strong>
            {employee.first_name} {employee.last_name}
          </strong>{' '}
          ({employee.employee_code})? This action cannot be undone.
        </p>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={deleting}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;

