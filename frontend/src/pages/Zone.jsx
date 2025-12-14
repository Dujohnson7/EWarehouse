import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TablePagination from '../components/TablePagination';
import zoneService from '../services/zoneService';

const Zone = () => {
    // State
    const [zones, setZones] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);

    // Fetch Data
    useEffect(() => {
        loadZones();
    }, []);

    const loadZones = async () => {
        try {
            const data = await zoneService.getAllZones();
            setZones(data);
        } catch (error) {
            console.error("Failed to load zones", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this zone?')) {
            try {
                await zoneService.deleteZone(id, 1);  
                loadZones();
            } catch (error) {
                console.error("Failed to delete zone", error);
                alert("Failed to delete zone");
            }
        }
    };

    // Logic
    const filteredZones = zones.filter(zone => {
        const matchesSearch = zone.zoneName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (zone.description && zone.description.toLowerCase().includes(searchTerm.toLowerCase()));

        const status = zone.isActive ? 'Active' : 'Inactive';
        const matchesStatus = selectedStatus === 'All' || status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredZones.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Get unique statuses
    const statuses = ['All', 'Active', 'Inactive'];

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Zone Management</h5>

                <div className="widget-content searchable-container list">
                    <div className="card card-body">
                        <div className="row">
                            <div className="col-md-4 col-xl-3">
                                <form className="position-relative" onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        type="text"
                                        className="form-control product-search ps-5"
                                        id="input-search"
                                        placeholder="Search Zones..."
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
                                <Link to="/zone/add" className="btn btn-primary d-flex align-items-center">
                                    <i className="ti ti-plus text-white me-1 fs-5"></i> Add New Zone
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="card card-body">
                        <div className="table-responsive">
                            <table className="table search-table align-middle text-nowrap">
                                <thead className="header-item">
                                    <tr>
                                        <th>Zone ID</th>
                                        <th>Zone Name</th>
                                        <th>Warehouse</th> 
                                        <th>Status</th>
                                        <th>Created Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="7" className="text-center">Loading...</td></tr>
                                    ) : currentItems.length > 0 ? (
                                        currentItems.map((zone) => (
                                            <tr key={zone.zoneID} className="search-items">
                                                <td><span className="usr-zone-id">{zone.zoneID}</span></td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="ms-2">
                                                            <div className="user-meta-info">
                                                                <h6 className="user-name mb-0" data-name={zone.zoneName}>{zone.zoneName}</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><span className="usr-warehouse">{zone.warehouse ? zone.warehouse.name : 'N/A'}</span></td> 
                                                <td>
                                                    <span className={`badge bg-${zone.isActive ? 'success' : 'danger'}-subtle text-${zone.isActive ? 'success' : 'danger'}`}>
                                                        {zone.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td><span className="usr-created-date">{new Date(zone.createdAt).toLocaleDateString()}</span></td>
                                                <td>
                                                    <div className="action-btn">
                                                        <Link to={`/zone/edit/${zone.zoneID}`} className="text-primary edit">
                                                            <i className="ti ti-edit fs-5"></i>
                                                        </Link>
                                                        <a href="#" className="text-dark delete ms-2" onClick={(e) => { e.preventDefault(); handleDelete(zone.zoneID); }}>
                                                            <i className="ti ti-trash fs-5"></i>
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center">No zones found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <TablePagination
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredZones.length}
                            paginate={paginate}
                            setItemsPerPage={setItemsPerPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Zone;
