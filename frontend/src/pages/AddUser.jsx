import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import warehouseService from '../services/warehouseService';

const AddUser = () => {
    const navigate = useNavigate();

    const [warehouses, setWarehouses] = useState([]);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        role: '',
        passwordInfo: '',
        warehouseID: '',
        isActive: true
    });

    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                const data = await warehouseService.getAllWarehouses();
                setWarehouses(data);
            } catch (error) {
                console.error("Failed to load warehouses", error);
            }
        };
        fetchWarehouses();
    }, []);

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
            // Need to map values to DTO
            const userData = {
                fullName: formData.fullName,
                email: formData.email,
                role: formData.role,
                passwordInfo: formData.passwordInfo,
                warehouseID: formData.warehouseID ? parseInt(formData.warehouseID) : null,
                isActive: formData.isActive
            };

            await userService.createUser(userData);
            navigate('/users');
        } catch (error) {
            console.error("Failed to create user", error);
            alert("Failed to create user");
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Add User</h5>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="fullName" className="form-label">Full Name</label>
                                <input type="text" className="form-control" id="fullName" placeholder="Enter Full Name" value={formData.fullName} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email" className="form-control" id="email" placeholder="Enter email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="warehouseID" className="form-label">Warehouse (Optional)</label>
                                <select className="form-select" id="warehouseID" value={formData.warehouseID} onChange={handleChange}>
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
                                <label htmlFor="passwordInfo" className="form-label">Password</label>
                                <input type="password" className="form-control" id="passwordInfo" placeholder="Enter password" value={formData.passwordInfo} onChange={handleChange} required />
                            </div>
                            <div className="mb-3 form-check">
                                <input type="checkbox" className="form-check-input" id="isActive" checked={formData.isActive} onChange={handleChange} />
                                <label className="form-check-label" htmlFor="isActive">Active</label>
                            </div>
                            <button type="submit" className="btn btn-primary me-2">Save</button>
                            <Link to="/users" className="btn btn-secondary">Back</Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddUser;
