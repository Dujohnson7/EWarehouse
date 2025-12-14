import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import binService from '../services/binService';
import warehouseService from '../services/warehouseService';
import zoneService from '../services/zoneService';

const AddBin = () => {
    const navigate = useNavigate();

    const [warehouses, setWarehouses] = useState([]);
    const [allZones, setAllZones] = useState([]);
    const [filteredZones, setFilteredZones] = useState([]);

    const [formData, setFormData] = useState({
        binCode: '',
        warehouseId: '',
        zoneId: '',
        capacity: '',
        isActive: true
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [warehousesData, zonesData] = await Promise.all([
                    warehouseService.getAllWarehouses(),
                    zoneService.getAllZones()
                ]);
                setWarehouses(warehousesData);
                setAllZones(zonesData);
            } catch (error) {
                console.error("Failed to load data", error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'warehouseId') {
            const warehouseId = parseInt(value);
            const zonesForWarehouse = allZones.filter(z => z.warehouseID === warehouseId);
            setFilteredZones(zonesForWarehouse);
            setFormData(prev => ({ ...prev, warehouseId: value, zoneId: '' }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const binData = {
                BinCode: formData.binCode,
                WarehouseID: parseInt(formData.warehouseId),
                ZoneID: parseInt(formData.zoneId),
                Capacity: parseInt(formData.capacity)
            };

            await binService.createBin(binData, 1);
            navigate('/bins');
        } catch (error) {
            console.error("Failed to create bin", error);
            alert("Failed to create bin");
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Add New Bin</h5>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="binCode" className="form-label">Bin Code</label>
                        <input
                            type="text"
                            className="form-control"
                            id="binCode"
                            name="binCode"
                            value={formData.binCode}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="warehouseId" className="form-label">Warehouse</label>
                        <select
                            className="form-select"
                            id="warehouseId"
                            name="warehouseId"
                            value={formData.warehouseId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Warehouse</option>
                            {warehouses.map(wh => (
                                <option key={wh.warehouseID} value={wh.warehouseID}>{wh.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="zoneId" className="form-label">Zone</label>
                        <select
                            className="form-select"
                            id="zoneId"
                            name="zoneId"
                            value={formData.zoneId}
                            onChange={handleChange}
                            required
                            disabled={!formData.warehouseId}
                        >
                            <option value="">Select Zone</option>
                            {filteredZones.map(zone => (
                                <option key={zone.zoneID} value={zone.zoneID}>{zone.zoneName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="capacity" className="form-label">Capacity</label>
                        <input
                            type="number"
                            className="form-control"
                            id="capacity"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            required
                        />
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
                        <label className="form-check-label" htmlFor="isActive">Is Active</label>
                    </div>
                    <button type="submit" className="btn btn-primary me-2">Save</button>
                    <Link to="/bins" className="btn btn-secondary">Back</Link>
                </form>
            </div>
        </div>
    );
};

export default AddBin;
