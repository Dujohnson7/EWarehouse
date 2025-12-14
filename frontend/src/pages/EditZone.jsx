import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import zoneService from '../services/zoneService';
import warehouseService from '../services/warehouseService';

const EditZone = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [warehouses, setWarehouses] = useState([]);
    const [formData, setFormData] = useState({
        zoneName: '',
        warehouseID: '', 
        isActive: true
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [zone, warehousesData] = await Promise.all([
                    zoneService.getZoneById(id),
                    warehouseService.getAllWarehouses()
                ]);

                setWarehouses(warehousesData);

                if (zone) {
                    setFormData({
                        zoneName: zone.zoneName,
                        warehouseID: zone.warehouseID, 
                        isActive: zone.isActive
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
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const zoneData = {
                zoneName: formData.zoneName,
                warehouseID: parseInt(formData.warehouseID),
                description: formData.description,
                isActive: formData.isActive
            };

            await zoneService.updateZone(id, zoneData, 1);
            navigate('/zone');
        } catch (error) {
            console.error("Failed to update zone", error);
            alert("Failed to update zone");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Edit Zone</h5>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="zoneName" className="form-label">Zone Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="zoneName"
                                    value={formData.zoneName}
                                    onChange={handleChange}
                                    required
                                />
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
                            <div className="mb-3 form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label" htmlFor="isActive">Active</label>
                            </div>
                            <button type="submit" className="btn btn-primary me-2">Update</button>
                            <Link to="/zone" className="btn btn-secondary">Back</Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditZone;
