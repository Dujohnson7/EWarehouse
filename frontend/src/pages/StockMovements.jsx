import React, { useState, useEffect } from 'react';
import TablePagination from '../components/TablePagination';
import stockMovementService from '../services/stockMovementService';

const StockMovements = () => {
    // State
    const [movements, setMovements] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);

    // Fetch Data
    useEffect(() => {
        const fetchMovements = async () => {
            try {
                const data = await stockMovementService.getAllMovements();
                setMovements(data);
            } catch (error) {
                console.error("Failed to load stock movements", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovements();
    }, []);

    // Logic
    const filteredMovements = movements.filter(mov => {
        // Safe access in case of nulls
        const productName = mov.productName || mov.product?.productName || '';
        const warehouseName = mov.warehouseName || mov.warehouse?.name || '';
        const userName = mov.userName || mov.user?.fullName || '';

        const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            warehouseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            userName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = selectedType === 'All' || mov.movementType === selectedType;

        return matchesSearch && matchesType;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredMovements.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Get unique types
    const types = ['All', 'IN', 'OUT', 'ADJUST', 'TRANSFER_IN', 'TRANSFER_OUT'];

    const getTypeBadgeClass = (type) => {
        switch (type) {
            case 'IN': return 'bg-success-subtle text-success';
            case 'OUT': return 'bg-danger-subtle text-danger';
            case 'TRANSFER_IN': return 'bg-info-subtle text-info';
            case 'TRANSFER_OUT': return 'bg-warning-subtle text-warning';
            case 'ADJUST': return 'bg-secondary-subtle text-secondary';
            default: return 'bg-primary-subtle text-primary';
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Stock Movements</h5>

                <div className="widget-content searchable-container list">
                    <div className="card card-body">
                        <div className="row">
                            <div className="col-md-4 col-xl-3">
                                <form className="position-relative" onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        type="text"
                                        className="form-control product-search ps-5"
                                        id="input-search"
                                        placeholder="Search Movements..."
                                        value={searchTerm}
                                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                    />
                                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3"></i>
                                </form>
                            </div>
                            <div className="col-md-4 col-xl-3 mt-3 mt-md-0">
                                <select
                                    className="form-select"
                                    value={selectedType}
                                    onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1); }}
                                >
                                    {types.map(t => (
                                        <option key={t} value={t}>{t}</option>
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
                                        <th>Movement ID</th>
                                        <th>Product</th>
                                        <th>Warehouse</th>
                                        <th>User</th>
                                        <th>Type</th>
                                        <th>Quantity</th>
                                        <th>Reason</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="8" className="text-center">Loading...</td></tr>
                                    ) : currentItems.length > 0 ? (
                                        currentItems.map((mov) => (
                                            <tr key={mov.movementID} className="search-items">
                                                <td><span className="usr-mov-id">{mov.movementID}</span></td>
                                                <td><span className="usr-product-name">{mov.product?.productName || 'N/A'}</span></td>
                                                <td>
                                                    <span className="usr-warehouse">
                                                        {mov.movementType === 'TRANSFER_OUT' || mov.movementType === 'OUT'
                                                            ? `From ${mov.warehouse?.name || 'N/A'}`
                                                            : `To ${mov.warehouse?.name || 'N/A'}`}
                                                    </span>
                                                </td>
                                                <td><span className="usr-user">{mov.user?.fullName}</span></td>
                                                <td>
                                                    <span className={`badge ${getTypeBadgeClass(mov.movementType)}`}>{mov.movementType}</span>
                                                </td>
                                                <td><span className="usr-quantity">{mov.quantity}</span></td>
                                                <td><span className="usr-reason">{mov.remarks}</span></td>
                                                <td><span className="usr-date">{new Date(mov.movementDate).toLocaleDateString()}</span></td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center">No movements found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <TablePagination
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredMovements.length}
                            paginate={paginate}
                            setItemsPerPage={setItemsPerPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockMovements;
