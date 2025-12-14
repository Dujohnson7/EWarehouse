import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import warehouseService from '../services/warehouseService';
import userService from '../services/userService';

const EditWarehouse = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Cascading Dropdown Data
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
        managerId: '',
        isActive: true
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [warehouse, users] = await Promise.all([
                    warehouseService.getWarehouseById(id),
                    userService.getAllUsers()
                ]);

                setManagers(users);

                if (warehouse) {
                    // Try to parse location: Province, District, Address
                    const parts = warehouse.location ? warehouse.location.split(', ') : [];
                    const prov = parts.length > 0 ? parts[0] : '';
                    const dist = parts.length > 1 ? parts[1] : '';
                    const addr = parts.length > 2 ? parts.slice(2).join(', ') : warehouse.location;

                    // Check if parsed province exists in our data, else put everything in address
                    const isKnownProvince = Object.keys(districtData).includes(prov);

                    setFormData({
                        name: warehouse.name,
                        province: warehouse.province || '',
                        district: warehouse.district || '',
                        address: warehouse.address || '',
                        managerId: warehouse.managerID || '',
                        isActive: warehouse.isActive
                    });

                    if (warehouse.province) {
                        setSelectedProvince(warehouse.province);
                        setAvailableDistricts(districtData[warehouse.province] || []);
                    }
                }
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    const handleProvinceChange = (e) => {
        const province = e.target.value;
        setSelectedProvince(province);
        setAvailableDistricts(districtData[province] || []);
        setFormData({ ...formData, province: province, district: '' });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let location = formData.address;
            if (formData.province && formData.district) {
                location = `${formData.province}, ${formData.district}, ${formData.address}`;
            }

            const warehouseData = {
                name: formData.name,
                country: 'RWANDA',
                province: formData.province,
                district: formData.district,
                address: formData.address,
                managerID: formData.managerId ? parseInt(formData.managerId) : null,
                isActive: formData.isActive
            };

            await warehouseService.updateWarehouse(id, warehouseData, 1);
            navigate('/warehouse');
        } catch (error) {
            console.error("Failed to update warehouse", error);
            alert("Failed to update warehouse");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Edit Warehouse</h5>
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

                            <div className="mb-3 form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="isActive"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label" htmlFor="isActive">Active</label>
                            </div>

                            <button type="submit" className="btn btn-primary me-2">Update</button>
                            <Link to="/warehouse" className="btn btn-secondary">Back</Link>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditWarehouse;
