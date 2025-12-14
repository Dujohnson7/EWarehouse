import React, { useState, useEffect } from 'react';
import TablePagination from '../components/TablePagination';
import auditLogService from '../services/auditLogService';

const AuditLogs = () => {
    // State
    const [auditLogs, setAuditLogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAction, setSelectedAction] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);

    // Fetch Data
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const data = await auditLogService.getAllAuditLogs();
                setAuditLogs(data);
            } catch (error) {
                console.error("Failed to load audit logs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    // Logic
    const filteredLogs = auditLogs.filter(log => {
        const action = log.action || '';
        const userId = log.userID ? log.userID.toString() : '';
        const details = log.details || '';

        const matchesSearch = action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            userId.includes(searchTerm) ||
            details.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesAction = selectedAction === 'All' || action.startsWith(selectedAction);

        return matchesSearch && matchesAction;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Get unique primary actions (first word) for filter
    const actions = ['All', ...new Set(auditLogs.map(l => l.action ? l.action.split(' ')[0] : 'Unknown'))];

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Audit Logs</h5>

                <div className="widget-content searchable-container list">
                    <div className="card card-body">
                        <div className="row">
                            <div className="col-md-4 col-xl-3">
                                <form className="position-relative" onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        type="text"
                                        className="form-control product-search ps-5"
                                        id="input-search"
                                        placeholder="Search Logs..."
                                        value={searchTerm}
                                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                    />
                                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3"></i>
                                </form>
                            </div>
                            <div className="col-md-4 col-xl-3 mt-3 mt-md-0">
                                <select
                                    className="form-select"
                                    value={selectedAction}
                                    onChange={(e) => { setSelectedAction(e.target.value); setCurrentPage(1); }}
                                >
                                    {actions.map((action, index) => (
                                        <option key={index} value={action}>{action}</option>
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
                                        <th>Audit ID</th>
                                        <th>User ID</th>
                                        <th>Action</th> 
                                        <th>Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="7" className="text-center">Loading...</td></tr>
                                    ) : currentItems.length > 0 ? (
                                        currentItems.map((log, index) => (
                                            <tr key={log.auditLogID || index} className="search-items">
                                                <td><span className="usr-audit-id">{log.auditID}</span></td>
                                                <td><span className="usr-user-id">{log.userID}</span></td>
                                                <td><span className="usr-action">{log.action}</span></td> 
                                                <td><span className="usr-created-at">{new Date(log.createdAt).toLocaleString()}</span></td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center">No logs found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <TablePagination
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredLogs.length}
                            paginate={paginate}
                            setItemsPerPage={setItemsPerPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
