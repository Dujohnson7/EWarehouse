import React, { useState, useEffect } from 'react';
import TablePagination from '../components/TablePagination';
import alertService from '../services/alertService';
import productService from '../services/productService'; // Assuming we need to resolve product names if not in DTO

const Alerts = () => {
    // State
    const [alerts, setAlerts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);

    // Fetch Data
    useEffect(() => {
        loadAlerts();
    }, []);

    const loadAlerts = async () => {
        try {
            const data = await alertService.getAllAlerts();
            // If the alert DTO doesn't contain product names, we might need to fetch them or assume they are included.
            // For now assuming the backend DTO returns 'productName' or we display the ID/Message.
            // Based on previous patterns, let's just set the data.
            setAlerts(data);
        } catch (error) {
            console.error("Failed to load alerts", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAcknowledge = async (id) => {
        try {
            // Fetch the specific alert to get its full data for update
            const alertToUpdate = await alertService.getAlertById(id);
            if (alertToUpdate) {
                const updatedAlert = { ...alertToUpdate, isAcknowledged: true };
                await alertService.updateAlert(id, updatedAlert, 1); // Hardcoded UserID 1

                // Update local state
                setAlerts(prev => prev.map(a => a.alertID === id ? { ...a, isAcknowledged: true } : a));
            }
        } catch (error) {
            console.error("Failed to acknowledge alert", error);
            alert("Failed to acknowledge alert");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this alert?")) {
            try {
                await alertService.deleteAlert(id, 1);
                setAlerts(prev => prev.filter(a => a.alertID !== id));
            } catch (error) {
                console.error("Failed to delete alert", error);
                alert("Failed to delete alert");
            }
        }
    }

    // Logic
    const filteredAlerts = alerts.filter(alert => {
        const matchesSearch = (alert.productID && String(alert.productID).includes(searchTerm)) ||
            (alert.alertMessage && alert.alertMessage.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesType = selectedType === 'All' || alert.alertType === selectedType;

        return matchesSearch && matchesType;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAlerts.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Get unique types
    const types = ['All', ...new Set(alerts.map(a => a.alertType))];

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">System Alerts</h5>

                {/* Summary Cards */}
                <div className="row mb-4">
                    {/* Row 1: Status Counts */}
                    <div className="col-lg-4">
                        <div className="card bg-primary-subtle shadow-none w-100 h-100 mb-0">
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="round-40 rounded-circle text-white d-flex align-items-center justify-content-center bg-primary">
                                        <iconify-icon icon="solar:bell-bing-line-duotone" className="fs-6"></iconify-icon>
                                    </div>
                                    <h6 className="mb-0 ms-3">Total Alerts</h6>
                                </div>
                                <h4 className="fw-semibold mb-0">{alerts.length}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="card bg-success-subtle shadow-none w-100 h-100 mb-0">
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="round-40 rounded-circle text-white d-flex align-items-center justify-content-center bg-success">
                                        <iconify-icon icon="solar:check-circle-line-duotone" className="fs-6"></iconify-icon>
                                    </div>
                                    <h6 className="mb-0 ms-3">Acknowledged</h6>
                                </div>
                                <h4 className="fw-semibold mb-0">{alerts.filter(a => a.isAcknowledged).length}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="card bg-warning-subtle shadow-none w-100 h-100 mb-0">
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="round-40 rounded-circle text-white d-flex align-items-center justify-content-center bg-warning">
                                        <iconify-icon icon="solar:clock-circle-line-duotone" className="fs-6"></iconify-icon>
                                    </div>
                                    <h6 className="mb-0 ms-3">Pending</h6>
                                </div>
                                <h4 className="fw-semibold mb-0">{alerts.filter(a => !a.isAcknowledged).length}</h4>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="widget-content searchable-container list">
                    <div className="card card-body">
                        <div className="row">
                            <div className="col-md-4 col-xl-3">
                                <form className="position-relative" onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        type="text"
                                        className="form-control product-search ps-5"
                                        id="input-search"
                                        placeholder="Search Alerts..."
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
                                        <th>Alert ID</th>
                                        <th>Product ID</th>
                                        <th>Type</th>
                                        <th>Message</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="7" className="text-center">Loading...</td></tr>
                                    ) : currentItems.length > 0 ? (
                                        currentItems.map((alert) => (
                                            <tr key={alert.alertID} className="search-items">
                                                <td><span className="usr-alert-id">{alert.alertID}</span></td>
                                                <td><span className="usr-product-name">{alert.productID}</span></td>
                                                <td>
                                                    <span className={`badge bg-${alert.alertType === 'OutStock' ? 'danger' : 'warning'}-subtle text-${alert.alertType === 'OutStock' ? 'danger' : 'warning'}`}>
                                                        {alert.alertType}
                                                    </span>
                                                </td>
                                                <td><span className="usr-message">{alert.alertMessage}</span></td>
                                                <td>
                                                    <span className={`badge bg-${alert.isAcknowledged ? 'success' : 'secondary'}-subtle text-${alert.isAcknowledged ? 'success' : 'secondary'}`}>
                                                        {alert.isAcknowledged ? 'Acknowledged' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td><span className="usr-date">{new Date(alert.createdAt).toLocaleString()}</span></td>
                                                <td>
                                                    <div className="action-btn">
                                                        {!alert.isAcknowledged && (
                                                            <button
                                                                className="btn btn-sm btn-primary me-2"
                                                                onClick={() => handleAcknowledge(alert.alertID)}
                                                            >
                                                                Ack
                                                            </button>
                                                        )}
                                                        <a href="#" className="text-dark delete" onClick={(e) => { e.preventDefault(); handleDelete(alert.alertID); }}>
                                                            <i className="ti ti-trash fs-5"></i>
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center">No alerts found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <TablePagination
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredAlerts.length}
                            paginate={paginate}
                            setItemsPerPage={setItemsPerPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Alerts;
