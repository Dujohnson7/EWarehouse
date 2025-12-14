import React from 'react';

const TablePagination = ({
    currentPage,
    itemsPerPage,
    totalItems,
    paginate,
    setItemsPerPage
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);
    const indexOfFirstItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

    if (totalItems === 0) return null;

    return (
        <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-3">
            <div className="d-flex align-items-center gap-2">
                <span className="text-muted">Show:</span>
                <select
                    className="form-select form-select-sm"
                    style={{ width: 'auto' }}
                    value={itemsPerPage}
                    onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        paginate(1);
                    }}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
                <span className="text-muted">entries</span>
            </div>

            <div>
                <span className="text-muted">
                    Showing <span id="showingFrom">{indexOfFirstItem}</span> to <span id="showingTo">{indexOfLastItem}</span> of <span id="totalItems">{totalItems}</span> entries
                </span>
            </div>

            <nav>
                <ul className="pagination mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
                    </li>

                    {[...Array(totalPages)].map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => paginate(index + 1)}>
                                {index + 1}
                            </button>
                        </li>
                    ))}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default TablePagination;
