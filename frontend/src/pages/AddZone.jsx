import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import zoneService from '../services/zoneService';
import warehouseService from '../services/warehouseService';

const AddZone = () => {
    const navigate = useNavigate();
    const [warehouses, setWarehouses] = useState([]);
    const [formData, setFormData] = useState({
        zoneName: '',
        warehouseID: '',
        description: ''
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
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const zoneData = {
                zoneName: formData.zoneName,
                warehouseID: parseInt(formData.warehouseID)
            };
 
            await zoneService.createZone(zoneData, 1);
            navigate('/zone');
        } catch (error) {
            console.error("Failed to create zone", error);
            alert("Failed to create zone");
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Add Zone</h5>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="zoneName" className="form-label">Zone Name</label>
                                <input type="text" className="form-control" id="zoneName" placeholder="Enter zone name" value={formData.zoneName} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="warehouseID" className="form-label">Warehouse</label>
                                <select className="form-select" id="warehouseID" value={formData.warehouseID} onChange={handleChange} required>
                                    <option value="">Select Warehouse</option>
                                    {warehouses.map(wh => (
                                        <option key={wh.warehouseID} value={wh.warehouseID}>{wh.name}</option>
                                    ))}
                                </select>
                            </div> 
                            <button type="submit" className="btn btn-primary me-2">Save</button>
                            <Link to="/zone" className="btn btn-secondary">Back</Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddZone;
