import React, { useState, useEffect } from 'react';
import stockMovementService from '../services/stockMovementService';
import TablePagination from '../components/TablePagination';

const TransferIn = () => {
    const [transfers, setTransfers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [completingIds, setCompletingIds] = useState(new Set());

    useEffect(() => {
        fetchTransfers();
    }, []);

    const fetchTransfers = async () => {
        try {
            const data = await stockMovementService.getAllMovements();
            // Filter for pending TRANSFER_IN movements
            const pendingTransfers = data.filter(m =>
                m.movementType === 'TRANSFER_IN' && m.transferStatus === false
            );
            setTransfers(pendingTransfers);
        } catch (error) {
            console.error("Failed to load transfers", error);
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async (transfer) => {
        if (window.confirm('Are you sure you want to complete this transfer?')) {
            // Mark as completing to disable button
            setCompletingIds(prev => new Set(prev).add(transfer.movementID));

            try {
                // Prepare update data with same structure as create
                const updateData = {
                    productId: transfer.productID,
                    quantity: transfer.quantity,
                    transferCode: transfer.transferCode,
                    toBinId: transfer.toBinID,
                    remarks: transfer.remarks || ''
                };

                await stockMovementService.updateTransferIn(transfer.movementID, updateData);
                alert('Transfer completed successfully!');
                fetchTransfers(); // Refresh list
            } catch (error) {
                console.error("Failed to complete transfer", error);
                alert('Failed to complete transfer');
                // Remove from completing set on error
                setCompletingIds(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(transfer.movementID);
                    return newSet;
                });
            }
        }
    };

    // Filter and Pagination
    const filteredTransfers = transfers.filter(transfer => {
        const productName = transfer.product?.productName || '';
        const transferCodeStr = transfer.transferCode?.toString() || '';
        return productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transferCodeStr.includes(searchTerm);
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTransfers.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Pending Transfer In</h5>

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
                                        <th>To Bin</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="7" className="text-center">Loading...</td></tr>
                                    ) : currentItems.length > 0 ? (
                                        currentItems.map((transfer) => (
                                            <tr key={transfer.movementID} className="search-items">
                                                <td><span className="usr-transfer-code">{transfer.transferCode}</span></td>
                                                <td><span className="usr-product-name">{transfer.product?.productName || 'N/A'}</span></td>
                                                <td><span className="usr-quantity">{transfer.quantity}</span></td>
                                                <td><span className="usr-warehouse">{transfer.warehouse?.name || 'N/A'}</span></td>
                                                <td><span className="usr-bin">{transfer.toBinID || 'N/A'}</span></td>
                                                <td><span className="usr-date">{new Date(transfer.createdAt).toLocaleDateString()}</span></td>
                                                <td>
                                                    <div className="action-btn">
                                                        <button
                                                            className="btn btn-sm btn-success"
                                                            onClick={() => handleComplete(transfer)}
                                                            disabled={completingIds.has(transfer.movementID)}
                                                        >
                                                            {completingIds.has(transfer.movementID) ? 'Completing...' : 'Complete'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center">No pending transfers found</td>
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

export default TransferIn;
