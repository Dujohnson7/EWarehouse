import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import stockMovementService from '../services/stockMovementService';
import TablePagination from '../components/TablePagination';

const TransferOut = () => {
    const [transfers, setTransfers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        fetchTransfers();
    }, []);

    const fetchTransfers = async () => {
        try {
            const data = await stockMovementService.getAllMovements();
            // Filter for TRANSFER_OUT movements
            const transferOuts = data.filter(m => m.movementType === 'TRANSFER_OUT');
            setTransfers(transferOuts);
        } catch (error) {
            console.error("Failed to load transfers", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter and Pagination
    const filteredTransfers = transfers.filter(transfer => {
        const productName = transfer.product?.productName || '';
        const transferCodeStr = transfer.transferCode?.toString() || '';
        const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transferCodeStr.includes(searchTerm);

        const matchesStatus = selectedStatus === 'All' ||
            (selectedStatus === 'Completed' && transfer.transferStatus === true) ||
            (selectedStatus === 'Pending' && transfer.transferStatus === false);

        return matchesSearch && matchesStatus;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTransfers.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const statuses = ['All', 'Pending', 'Completed'];

    return (
        <div className="card">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="card-title fw-semibold mb-0">Transfer Out</h5>
                    <Link to="/transfer-out/add" className="btn btn-primary">
                        <i className="ti ti-plus"></i> Add Transfer Out
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
                                        placeholder="Search Transfers..."
                                        value={searchTerm}
                                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                    />
                                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3"></i>
                                </form>
                            </div>
                            <div className="col-md-4 col-xl-3 mt-3 mt-md-0">
                                <select
                                    className="form-select"
                                    value={selectedStatus}
                                    onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                                >
                                    {statuses.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="card card-body">
                        <div className="table-responsive">
                            <table className="table search-table align-middle text-nowrap">
                                <thead className="header-item">
                                    <tr>
                                        <th>Transfer Code</th>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>From Warehouse</th>
                                        <th>From Bin</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="8" className="text-center">Loading...</td></tr>
                                    ) : currentItems.length > 0 ? (
                                        currentItems.map((transfer) => (
                                            <tr key={transfer.movementID} className="search-items">
                                                <td><span className="usr-transfer-code">{transfer.transferCode}</span></td>
                                                <td><span className="usr-product-name">{transfer.product?.productName || 'N/A'}</span></td>
                                                <td><span className="usr-quantity">{transfer.quantity}</span></td>
                                                <td><span className="usr-warehouse">{transfer.warehouse?.name || 'N/A'}</span></td>
                                                <td><span className="usr-bin">{transfer.fromBinID || 'N/A'}</span></td>
                                                <td>
                                                    <span className={`badge ${transfer.transferStatus ? 'bg-success' : 'bg-warning'}`}>
                                                        {transfer.transferStatus ? 'Completed' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td><span className="usr-date">{new Date(transfer.createdAt).toLocaleDateString()}</span></td>
                                                <td>
                                                    <div className="action-btn">
                                                        <Link to={`/transfer-out/edit/${transfer.movementID}`} className="text-primary edit">
                                                            <i className="ti ti-edit fs-5"></i>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center">No transfers found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <TablePagination
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredTransfers.length}
                            paginate={paginate}
                            setItemsPerPage={setItemsPerPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransferOut;
