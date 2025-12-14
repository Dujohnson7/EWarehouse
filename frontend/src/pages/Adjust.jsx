import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import stockMovementService from '../services/stockMovementService';
import TablePagination from '../components/TablePagination';

const Adjust = () => {
    const [adjustments, setAdjustments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        fetchAdjustments();
    }, []);

    const fetchAdjustments = async () => {
        try {
            const data = await stockMovementService.getAllMovements();
            const adjustData = data.filter(m => m.movementType === 'ADJUST');
            setAdjustments(adjustData);
        } catch (error) {
            console.error("Failed to load adjustments", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this adjustment?')) {
            try {
                await stockMovementService.deleteStockAdjust(id);
                fetchAdjustments();
            } catch (error) {
                console.error("Failed to delete adjustment", error);
                alert('Failed to delete adjustment');
            }
        }
    };

    const filteredAdjustments = adjustments.filter(adj => {
        const productName = adj.product?.productName || '';
        return productName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAdjustments.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="card">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="card-title fw-semibold mb-0">Stock Adjustments</h5>
                    <Link to="/adjust/add" className="btn btn-primary">
                        <i className="ti ti-plus"></i> Add Adjustment
                    </Link>
                </div>

                <div className="widget-content searchable-container list">
                    <div className="card card-body">
                        <div className="row">
                            <div className="col-md-4 col-xl-3">
                                <form className="position-relative" onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        type="text"
                                        className="form-control product-search ps-5"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                    />
                                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3"></i>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="card card-body">
                        <div className="table-responsive">
                            <table className="table search-table align-middle text-nowrap">
                                <thead className="header-item">
                                    <tr>
                                        <th>ID</th>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Reason</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="6" className="text-center">Loading...</td></tr>
                                    ) : currentItems.length > 0 ? (
                                        currentItems.map((adj) => (
                                            <tr key={adj.movementID} className="search-items">
                                                <td><span className="usr-adj-id">{adj.movementID}</span></td>
                                                <td><span className="usr-product-name">{adj.product?.productName || 'N/A'}</span></td>
                                                <td><span className="usr-quantity">{adj.quantity}</span></td>
                                                <td><span className="usr-reason">{adj.reason || 'N/A'}</span></td>
                                                <td><span className="usr-date">{new Date(adj.createdAt).toLocaleDateString()}</span></td>
                                                <td>
                                                    <div className="action-btn">
                                                        <Link to={`/adjust/edit/${adj.movementID}`} className="text-primary edit">
                                                            <i className="ti ti-edit fs-5"></i>
                                                        </Link>
                                                        <a href="#" className="text-dark delete ms-2" onClick={(e) => { e.preventDefault(); handleDelete(adj.movementID); }}>
                                                            <i className="ti ti-trash fs-5"></i>
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center">No adjustments found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <TablePagination
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredAdjustments.length}
                            paginate={paginate}
                            setItemsPerPage={setItemsPerPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Adjust;
