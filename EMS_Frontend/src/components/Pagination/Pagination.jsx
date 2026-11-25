function Pagination({ page, totalPages, total, limit, onPageChange, onLimitChange }) {
  const pages = [];
  for (let i = 1; i <= totalPages; i += 1) {
    pages.push(i);
  }

  return (
    <div className="pagination-bar">
      <div className="pagination-info">
        <span>
          Total: <strong>{total}</strong> employee{total === 1 ? '' : 's'}
        </span>
        <select
          className="limit-select"
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          <option value={5}>5 / page</option>
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
        </select>
      </div>

      <div className="pagination-controls">
        <button
          type="button"
          className="btn btn-sm btn-secondary"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>

        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            className={`btn btn-sm ${pageNumber === page ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          className="btn btn-sm btn-secondary"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;

