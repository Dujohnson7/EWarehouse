import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userService from '../services/userService';
import TablePagination from '../components/TablePagination';
import PermissionGate from '../components/PermissionGate';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const roles = ['All', 'Admin', 'Manager', 'Staff']; 
    const statuses = ['All', 'Active', 'Inactive'];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch users", error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await userService.deleteUser(id);
                fetchUsers();
            } catch (error) {
                console.error("Failed to delete user", error);
            }
        }
    };

    // Filter and Pagination
    const filteredUsers = users.filter(user => {
        const username = user.username || '';
        const email = user.email || '';
        const matchesSearch = username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = selectedRole === 'All' || user.role === selectedRole;
        const matchesStatus = selectedStatus === 'All' ||
            (selectedStatus === 'Active' ? user.isActive : !user.isActive);

        return matchesSearch && matchesRole && matchesStatus;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">User Management</h5>

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
                                        placeholder="Search Users..."
                                        value={searchTerm}
                                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                    />
                                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3"></i>
                                </form>
                            </div>
                            <div className="col-md-3 col-xl-2 mt-3 mt-md-0">
                                <select
                                    className="form-select"
                                    value={selectedRole}
                                    onChange={(e) => { setSelectedRole(e.target.value); setCurrentPage(1); }}
                                >
                                    {roles.map((role, idx) => (
                                        <option key={idx} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3 col-xl-2 mt-3 mt-md-0">
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
                            <div className="col-md-3 col-xl-5 text-end d-flex justify-content-md-end justify-content-center mt-3 mt-md-0">
                                <PermissionGate type="insert">
                                    <Link to="/users/add" className="btn btn-primary d-flex align-items-center">
                                        <i className="ti ti-plus text-white me-1 fs-5"></i> Add New User
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
                                        <th>User ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Joined Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="7" className="text-center">Loading...</td></tr>
                                    ) : currentItems.length > 0 ? (
                                        currentItems.map((user) => (
                                            <tr key={user.userID} className="search-items">
                                                <td><span className="usr-id">{user.userID}</span></td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="ms-2">
                                                            <div className="user-meta-info">
                                                                <h6 className="user-name mb-0" data-name={user.fullName}>{user.fullName}</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><span className="usr-email-addr">{user.email}</span></td>
                                                <td><span className="usr-role">{user.role}</span></td>
                                                <td>
                                                    <span className={`badge bg-${user.isActive ? 'success' : 'danger'}-subtle text-${user.isActive ? 'success' : 'danger'}`}>
                                                        {user.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td><span className="usr-ph-no">{new Date(user.createdAt).toLocaleDateString()}</span></td>
                                                <td>
                                                    <div className="action-btn">
                                                        <PermissionGate type="update">
                                                            <Link to={`/users/edit/${user.userID}`} className="text-primary edit">
                                                                <i className="ti ti-edit fs-5"></i>
                                                            </Link>
                                                        </PermissionGate>
                                                        <PermissionGate type="delete">
                                                            <a href="#" className="text-dark delete ms-2" onClick={(e) => { e.preventDefault(); handleDelete(user.userID); }}>
                                                                <i className="ti ti-trash fs-5"></i>
                                                            </a>
                                                        </PermissionGate>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center">No users found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>


                        <TablePagination
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredUsers.length}
                            paginate={paginate}
                            setItemsPerPage={setItemsPerPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Users;
