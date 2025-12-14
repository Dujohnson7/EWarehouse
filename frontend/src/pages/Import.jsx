import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TablePagination from '../components/TablePagination';
import stockMovementService from '../services/stockMovementService';

const Import = () => {
    // State
    const [imports, setImports] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);

    // Fetch Data
    useEffect(() => {
        const fetchImports = async () => {
            try {
                // Fetch all and filter for IN
                const data = await stockMovementService.getAllMovements();
                const importsOnly = data.filter(m => m.movementType === 'IN');
                setImports(importsOnly);
            } catch (error) {
                console.error("Failed to load imports", error);
            } finally {
                setLoading(false);
            }
        };
        fetchImports();
    }, []);

    // Logic
    const filteredImports = imports.filter(imp => {
        const productName = imp.productName || imp.product?.productName || '';
        const id = imp.movementID.toString();

        const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            id.includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredImports.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Import Products Management</h5>

                <div className="widget-content searchable-container list">
                    <div className="card card-body">
                        <div className="row">
                            <div className="col-md-3 col-xl-3">
                                <form className="position-relative" onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        type="text"
                                        className="form-control product-search ps-5"
                                        id="input-search"
                                        placeholder="Search Imports..."
                                        value={searchTerm}
                                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                    />
                                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3"></i>
                                </form>
                            </div>
                            <div className="col-md-3 col-xl-5 text-end d-flex justify-content-md-end justify-content-center mt-3 mt-md-0 ms-auto">
                                <Link to="/import/add" className="btn btn-primary d-flex align-items-center">
                                    <i className="ti ti-plus text-white me-1 fs-5"></i> Add Import
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="card card-body">
                        <div className="table-responsive">
                            <table className="table search-table align-middle text-nowrap">
                                <thead className="header-item">
                                    <tr>
                                        <th>Import ID</th>
                                        <th>Product Name</th>
                                        <th>Quantity</th>
                                        <th>Warehouse</th>
                                        <th>Import Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="6" className="text-center">Loading...</td></tr>
                                    ) : currentItems.length > 0 ? (
                                        currentItems.map((imp) => (
                                            <tr key={imp.movementID} className="search-items">
                                                <td><span className="usr-import-id">{imp.movementID}</span></td>
                                                <td><span className="usr-product-name">{imp.product?.productName}</span></td>
                                                <td><span className="usr-import-quantity">{imp.quantity}</span></td>
                                                <td><span className="usr-import-warehouse">{imp.warehouse?.name}</span></td>
                                                <td><span className="usr-import-date">{new Date(imp.createdAt).toLocaleDateString()}</span></td>
                                                <td>
                                                    <div className="action-btn">
                                                        <Link to={`/import/edit/${imp.movementID}`} className="text-primary edit">
                                                            <i className="ti ti-edit fs-5"></i>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center">No imports found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <TablePagination
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredImports.length}
                            paginate={paginate}
                            setItemsPerPage={setItemsPerPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Import;
