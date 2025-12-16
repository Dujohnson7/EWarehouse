import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import userService from '../services/userService';
import warehouseService from '../services/warehouseService';
import authService from '../services/authService';

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [warehouses, setWarehouses] = useState([]);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        role: '',
        warehouseId: '',
        isActive: true,
        isInsert: false,
        isUpdate: false,
        isDelete: false,
        password: ''
    });
    const [loading, setLoading] = useState(true);
    const isAdmin = authService.isAdmin();
    const isGeneralManager = authService.getUserRole() === 'General_Manager';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [user, warehousesData] = await Promise.all([
                    userService.getUserById(id),
                    warehouseService.getAllWarehouses()
                ]);

                setWarehouses(warehousesData);
                if (user) {
                    setFormData({
                        fullName: user.fullName,
                        email: user.email,
                        role: user.role,
                        password: user.password,
                        warehouseID: user.warehouseID || '',
                        isActive: user.isActive,
                        isInsert: user.isInsert || false,
                        isUpdate: user.isUpdate || false,
                        isDelete: user.isDelete || false
                    });
                }
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = {
                userID: id,
                fullName: formData.fullName,
                email: formData.email,
                role: formData.role,
                warehouseID: formData.warehouseID ? parseInt(formData.warehouseID) : null,
                isUpdate: formData.isUpdate,
                isInsert: formData.isInsert,
                isDelete: formData.isDelete,
                isActive: formData.isActive,
                password: formData.password
            };

            await userService.updateUser(id, userData);
            navigate('/users');
        } catch (error) {
            console.error("Failed to update user", error);
            alert("Failed to update user");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Edit User</h5>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="fullName" className="form-label">Full Name</label>
                                <input type="text" className="form-control" id="fullName" value={formData.fullName} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email" className="form-control" id="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="warehouseID" className="form-label">Warehouse (Optional)</label>
                                <select className="form-select" id="warehouseID" value={formData.warehouseID} onChange={handleChange} disabled={!isAdmin && !isGeneralManager}>
                                    <option value="">Select Warehouse</option>
                                    {warehouses.map(wh => (
                                        <option key={wh.warehouseID} value={wh.warehouseID}>{wh.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="role" className="form-label">Role</label>
                                <select className="form-select" id="role" value={formData.role} onChange={handleChange} required>
                                    <option value="">Select Role</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Clerk">Clerk</option>
                                    <option value="General_Manager">General Manager</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">New Password (leave blank to keep current)</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Permissions</label>
                                <div className="d-flex gap-3">
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="isInsert" checked={formData.isInsert} onChange={handleChange} />
                                        <label className="form-check-label" htmlFor="isInsert">Can Insert</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="isUpdate" checked={formData.isUpdate} onChange={handleChange} />
                                        <label className="form-check-label" htmlFor="isUpdate">Can Update</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="isDelete" checked={formData.isDelete} onChange={handleChange} />
                                        <label className="form-check-label" htmlFor="isDelete">Can Delete</label>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3 form-check">
                                <input type="checkbox" className="form-check-input" id="isActive" checked={formData.isActive} onChange={handleChange} />
                                <label className="form-check-label" htmlFor="isActive">Active</label>
                            </div>
                            <button type="submit" className="btn btn-primary me-2">Update</button>
                            <Link to="/users" className="btn btn-secondary">Back</Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditUser;
