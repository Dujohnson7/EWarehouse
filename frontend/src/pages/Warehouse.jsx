import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import warehouseService from '../services/warehouseService';
import TablePagination from '../components/TablePagination';
import PermissionGate from '../components/PermissionGate';

const Warehouse = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const statuses = ['All', 'Active', 'Inactive'];

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const fetchWarehouses = async () => {
        try {
            const data = await warehouseService.getAllWarehouses();
            setWarehouses(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch warehouses", error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this warehouse?")) {
            try {
                await warehouseService.deleteWarehouse(id);
                fetchWarehouses();
            } catch (error) {
                console.error("Failed to delete warehouse", error);
            }
        }
    };

    // Filter and Pagination
    const filteredWarehouses = warehouses.filter(warehouse => {
        const name = warehouse.name || '';
        const location = warehouse.location || '';
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'All' ||
            (selectedStatus === 'Active' ? warehouse.isActive : !warehouse.isActive);
        return matchesSearch && matchesStatus;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredWarehouses.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Warehouse Management</h5>

                <div className="widget-content searchable-container list">
                    <div className="card card-body">
                        <div className="row">
                            {/* ... Search ... */}
                            <div className="col-md-4 col-xl-3">
                                <form className="position-relative" onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        type="text"
                                        className="form-control product-search ps-5"
                                        id="input-search"
                                        placeholder="Search Warehouses..."
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
                            <div className="col-md-4 col-xl-6 text-end d-flex justify-content-md-end justify-content-center mt-3 mt-md-0">
                                <PermissionGate type="insert">
                                    <Link to="/warehouse/add" className="btn btn-primary d-flex align-items-center">
                                        <i className="ti ti-plus text-white me-1 fs-5"></i> Add Warehouse
                                    </Link>
                                </PermissionGate>
                            </div>
                        </div>
                    </div>

                    <div className="card card-body">
                        <div className="table-responsive">
                            <table className="table search-table align-middle text-nowrap">
                                <thead className="header-item">
                                    <tr>
                                        <th>Warehouse ID</th>
                                        <th>Warehouse Name</th>
                                        <th>Location</th>
                                        <th>Status</th>
                                        <th>Created Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="6" className="text-center">Loading...</td></tr>
                                    ) : currentItems.length > 0 ? (
                                        currentItems.map((warehouse) => (
                                            <tr key={warehouse.warehouseID} className="search-items">
                                                <td><span className="usr-warehouse-id">{warehouse.warehouseID}</span></td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="ms-2">
                                                            <div className="user-meta-info">
                                                                <h6 className="user-name mb-0" data-name={warehouse.name}>{warehouse.name}</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><span className="usr-warehouse-location">{warehouse?.province ?? 'N/A'}, {warehouse?.district ?? 'N/A'}, {warehouse?.address ?? 'N/A'}</span></td>
                                                <td>
                                                    <span className={`badge bg-${warehouse.isActive ? 'success' : 'danger'}-subtle text-${warehouse.isActive ? 'success' : 'danger'}`}>
                                                        {warehouse.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td><span className="usr-created-date">{new Date(warehouse.createdAt).toLocaleDateString()}</span></td>
                                                <td>
                                                    <div className="action-btn">
                                                        <PermissionGate type="update">
                                                            <Link to={`/warehouse/edit/${warehouse.warehouseID}`} className="text-primary edit">
                                                                <i className="ti ti-edit fs-5"></i>
                                                            </Link>
                                                        </PermissionGate>
                                                        <PermissionGate type="delete">
                                                            <a href="#" className="text-dark delete ms-2" onClick={(e) => { e.preventDefault(); handleDelete(warehouse.warehouseID); }}>
                                                                <i className="ti ti-trash fs-5"></i>
                                                            </a>
                                                        </PermissionGate>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center">No warehouses found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <TablePagination
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredWarehouses.length}
                            paginate={paginate}
                            setItemsPerPage={setItemsPerPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Warehouse;
