import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import binService from '../services/binService';
import warehouseService from '../services/warehouseService';
import zoneService from '../services/zoneService';

const EditBin = () => {
    const { id } = useParams();
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bin, warehousesData, zonesData] = await Promise.all([
                    binService.getBinByCode(id),
                    warehouseService.getAllWarehouses(),
                    zoneService.getAllZones()
                ]);

                setWarehouses(warehousesData);
                setAllZones(zonesData);

                if (bin) {
                    // Handle both camelCase and PascalCase from backend
                    const zoneID = bin.zoneID || bin.ZoneID;
                    const zone = zonesData.find(z => z.zoneID === zoneID);
                    const warehouseId = zone ? zone.warehouseID : '';

                    // Filter zones for this warehouse
                    const zonesForWarehouse = zonesData.filter(z => z.warehouseID === warehouseId);
                    setFilteredZones(zonesForWarehouse);

                    setFormData({
                        binCode: bin.binCode || bin.BinCode,
                        warehouseId: warehouseId,
                        zoneId: zoneID,
                        capacity: bin.capacity || bin.Capacity,
                        isActive: bin.isActive !== undefined ? bin.isActive : bin.IsActive
                    });
                }
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

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
                WarehouseID: parseInt(formData.warehouseId),
                ZoneID: parseInt(formData.zoneId),
                Capacity: parseInt(formData.capacity),
                IsActive: formData.isActive
            };

            await binService.updateBin(id, binData, 1);
            navigate('/bins');
        } catch (error) {
            console.error("Failed to update bin", error);
            alert("Failed to update bin");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Edit Bin</h5>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="binCode" className="form-label">Bin Code</label>
                        <input
                            type="text"
                            className="form-control"
                            id="binCode"
                            name="binCode"
                            value={formData.binCode}
                            readOnly // ID cannot be changed usually
                            disabled
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
                    <button type="submit" className="btn btn-primary me-2">Update</button>
                    <Link to="/bins" className="btn btn-secondary">Back</Link>
                </form>
            </div>
        </div>
    );
};

export default EditBin;
