import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import binService from '../services/binService';
import warehouseService from '../services/warehouseService';
import zoneService from '../services/zoneService';
import TablePagination from '../components/TablePagination';
import PermissionGate from '../components/PermissionGate';

const Bins = () => {
    const [bins, setBins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedWarehouse, setSelectedWarehouse] = useState('All');
    const [selectedZone, setSelectedZone] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [warehouseOptions, setWarehouseOptions] = useState(['All']);
    const [zoneOptions, setZoneOptions] = useState(['All']);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [binsData, warehousesData, zonesData] = await Promise.all([
                binService.getAllBins(),
                warehouseService.getAllWarehouses(),
                zoneService.getAllZones()
            ]);

            setBins(binsData);
            setWarehouseOptions(['All', ...warehousesData.map(w => w.name)]);
            setZoneOptions(['All', ...zonesData.map(z => z.zoneName)]);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch data", error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this bin?")) {
            try {
                await binService.deleteBin(id);
                fetchData();
            } catch (error) {
                console.error("Failed to delete bin", error);
            }
        }
    };

    // Filter and Pagination
    const filteredBins = bins.filter(bin => {
        const binCode = bin.binCode || '';
        const warehouseName = bin.zone?.warehouse?.name || '';
        const zoneName = bin.zone?.zoneName || '';

        const matchesSearch = binCode.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesWarehouse = selectedWarehouse === 'All' || warehouseName === selectedWarehouse;
        const matchesZone = selectedZone === 'All' || zoneName === selectedZone;
        const matchesStatus = selectedStatus === 'All' ||
            (selectedStatus === 'Active' ? bin.isActive : !bin.isActive);

        return matchesSearch && matchesWarehouse && matchesZone && matchesStatus;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBins.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Bin Management</h5>

                <div className="widget-content searchable-container list">
                    <div className="card card-body">
                        <div className="row">
                            {/* ... Search ... */}
                            <div className="col-md-3 col-xl-3">
                                <form className="position-relative" onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        type="text"
                                        className="form-control product-search ps-5"
                                        id="input-search"
                                        placeholder="Search Bins..."
                                        value={searchTerm}
                                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                    />
                                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3"></i>
                                </form>
                            </div>
                            <div className="col-md-3 col-xl-2 mt-3 mt-md-0">
                                <select
                                    className="form-select"
                                    value={selectedWarehouse}
                                    onChange={(e) => { setSelectedWarehouse(e.target.value); setCurrentPage(1); }}
                                >
                                    {warehouseOptions.map(wh => (
                                        <option key={wh} value={wh}>{wh}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3 col-xl-2 mt-3 mt-md-0">
                                <select
                                    className="form-select"
                                    value={selectedZone}
                                    onChange={(e) => { setSelectedZone(e.target.value); setCurrentPage(1); }}
                                >
                                    {zoneOptions.map(z => (
                                        <option key={z} value={z}>{z}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3 col-xl-2 mt-3 mt-md-0">
                                <select
                                    className="form-select"
                                    value={selectedStatus}
                                    onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                                >
                                    <option value="All">All Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>

                            <div className="col-md-12 col-xl-3 text-end d-flex justify-content-md-end justify-content-center mt-3 mt-xl-0">
                                <PermissionGate type="insert">
                                    <Link to="/bins/add" className="btn btn-primary d-flex align-items-center">
                                        <i className="ti ti-plus text-white me-1 fs-5"></i> Add Bin
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
                                        <th>Bin Code</th>
                                        <th>Warehouse</th>
                                        <th>Zone</th>
                                        <th>Capacity</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="6" className="text-center">Loading...</td></tr>
                                    ) : currentItems.length > 0 ? (
                                        currentItems.map((bin) => (
                                            <tr key={bin.binCode} className="search-items">
                                                <td><span className="usr-bin-code">{bin.binCode}</span></td>
                                                <td><span className="usr-warehouse-name">{bin.zone?.warehouse?.name || 'N/A'}</span></td>
                                                <td><span className="usr-zone-name">{bin.zone?.zoneName || 'N/A'}</span></td>
                                                <td><span className="usr-capacity">{bin.capacity}</span></td>
                                                <td>
                                                    <span className={`badge bg-${bin.isActive ? 'success' : 'danger'}-subtle text-${bin.isActive ? 'success' : 'danger'}`}>
                                                        {bin.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-btn">
                                                        <PermissionGate type="update">
                                                            <Link to={`/bins/edit/${bin.binCode}`} className="text-primary edit">
                                                                <i className="ti ti-edit fs-5"></i>
                                                            </Link>
                                                        </PermissionGate>
                                                        <PermissionGate type="delete">
                                                            <a href="#" className="text-dark delete ms-2" onClick={(e) => { e.preventDefault(); handleDelete(bin.binCode); }}>
                                                                <i className="ti ti-trash fs-5"></i>
                                                            </a>
                                                        </PermissionGate>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center">No bins found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <TablePagination
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredBins.length}
                            paginate={paginate}
                            setItemsPerPage={setItemsPerPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bins;
