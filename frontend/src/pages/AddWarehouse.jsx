import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import warehouseService from '../services/warehouseService';
import userService from '../services/userService';

const AddWarehouse = () => {
    const navigate = useNavigate();

    const districtData = {
        "KIGALI": ["Gasabo", "Nyarugenge", "Kicukiro"],
        "NORTH": ["Burera", "Gakenke", "Gicumbi", "Musanze", "Rulindo"],
        "SOUTH": ["Gisagara", "Huye", "Kamonyi", "Muhanga", "Nyamagabe", "Nyanza", "Nyaruguru", "Ruhango"],
        "WEST": ["Karongi", "Ngororero", "Nyabihu", "Nyamasheke", "Rubavu", "Rusizi", "Rutsiro"],
        "EAST": ["Bugesera", "Gatsibo", "Kayonza", "Kirehe", "Ngoma", "Nyagatare", "Rwamagana"]
    };

    const [selectedProvince, setSelectedProvince] = useState('');
    const [availableDistricts, setAvailableDistricts] = useState([]);
    const [managers, setManagers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        province: '',
        district: '',
        address: '',
        managerId: ''
    });

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const data = await userService.getAllUsers();
                setManagers(data);
            } catch (error) {
                console.error("Failed to load users", error);
            }
        };
        fetchManagers();
    }, []);

    const handleProvinceChange = (e) => {
        const province = e.target.value;
        setSelectedProvince(province);
        setAvailableDistricts(districtData[province] || []);
        setFormData({ ...formData, province: province, district: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const location = `${formData.province}, ${formData.district}, ${formData.address}`;
            const warehouseData = {
                name: formData.name,
                country: 'RWANDA',
                province: formData.province,
                district: formData.district,
                address: formData.address,
                managerID: formData.managerId ? parseInt(formData.managerId) : null
            };

            await warehouseService.createWarehouse(warehouseData, 1);
            navigate('/warehouse');
        } catch (error) {
            console.error("Failed to create warehouse", error);
            alert("Failed to create warehouse");
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Add Warehouse</h5>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">
                                <label className="form-label">Warehouse Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter warehouse name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Province</label>
                                <select
                                    className="form-select"
                                    id="province"
                                    name="province"
                                    value={selectedProvince}
                                    onChange={handleProvinceChange}
                                    required
                                >
                                    <option value="">Select Province</option>
                                    <option value="KIGALI">Kigali City</option>
                                    <option value="EAST">East</option>
                                    <option value="WEST">West</option>
                                    <option value="SOUTH">South</option>
                                    <option value="NORTH">North</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">District</label>
                                <select
                                    className="form-select"
                                    id="district"
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    required
                                    disabled={!selectedProvince}
                                >
                                    <option value="">Select District</option>
                                    {availableDistricts.map((d) => (
                                        <option key={d} value={d.toUpperCase()}>{d}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Address</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Manager</label>
                                <select
                                    className="form-select"
                                    name="managerId"
                                    value={formData.managerId}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Manager</option>
                                    {managers.map((manager) => (
                                        <option key={manager.userID} value={manager.userID}>{manager.fullName}</option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" className="btn btn-primary me-2">Save</button>
                            <Link to="/warehouse" className="btn btn-secondary">Back</Link>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddWarehouse;
