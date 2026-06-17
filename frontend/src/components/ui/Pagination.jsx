const Pagination = ({ page, totalPages, onPageChange }) => {
  return (
    <div className="flex gap-2 justify-center mt-4">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-1 bg-gray-700 rounded"
      >
        Prev
      </button>

      <span className="px-3 py-1">
        {page} / {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-1 bg-gray-700 rounded"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;