import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import stockMovementService from '../services/stockMovementService';
import productService from '../services/productService';
import warehouseService from '../services/warehouseService';
import binService from '../services/binService';
import zoneService from '../services/zoneService';
import productLocationService from '../services/productLocationService';
import authService from '../services/authService';

const AddImport = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [zones, setZones] = useState([]);
    const [filteredZones, setFilteredZones] = useState([]);
    const [bins, setBins] = useState([]);
    const [filteredBins, setFilteredBins] = useState([]);
    const [productLocations, setProductLocations] = useState([]);
    const [binStatusMap, setBinStatusMap] = useState({}); // Map of binCode -> { usage, isFull, isBusy }
    const isAdmin = authService.isAdmin();
    const isGeneralManager = authService.getUserRole() === 'General_Manager';
    const userWarehouseId = authService.getUserWarehouse();
    const [formData, setFormData] = useState({
        productId: '',
        quantity: '',
        warehouseId: '',
        zoneId: '',
        toBinId: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, warehousesData, zonesData, binsData, locationsData] = await Promise.all([
                    productService.getAllProducts(),
                    warehouseService.getAllWarehouses(),
                    zoneService.getAllZones(),
                    binService.getAllBins(),
                    productLocationService.getAllProductLocations()
                ]);
                setProducts(productsData);
                setWarehouses(warehousesData);
                setZones(zonesData);
                setBins(binsData);
                setProductLocations(locationsData);

                // Calculate Bin Usage
                const statusMap = {};
                binsData.forEach(bin => {
                    // Filter locations for this bin
                    const binLocs = locationsData.filter(loc => loc.binID === bin.binCode);
                    const usage = binLocs.reduce((sum, loc) => sum + loc.quantity, 0);
                    const capacity = bin.capacity || 100;
                    statusMap[bin.binCode] = {
                        usage: usage,
                        capacity: capacity,
                        isBusy: usage > 0,
                        isFull: usage >= capacity
                    };
                });
                setBinStatusMap(statusMap);

                if (!isAdmin && !isGeneralManager && userWarehouseId) {
                    setFormData(prev => ({ ...prev, warehouseId: userWarehouseId }));
                    const warehouseZones = zonesData.filter(z => z.warehouseID === parseInt(userWarehouseId));
                    setFilteredZones(warehouseZones);
                    setFilteredBins([]);
                }
            } catch (error) {
                console.error("Failed to load dropdown data", error);
            }
        };
        fetchData();
    }, [isAdmin, isGeneralManager, userWarehouseId]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));

        if (id === 'warehouseId') {
            const warehouseID = parseInt(value);
            const warehouseZones = zones.filter(z => z.warehouseID === warehouseID);
            setFilteredZones(warehouseZones);
            setFilteredBins([]);
            setFormData(prev => ({ ...prev, zoneId: '', toBinId: '' }));
        }

        if (id === 'zoneId') {
            const zoneID = parseInt(value);
            const zoneBins = bins.filter(b => b.zoneID === zoneID);
            setFilteredBins(zoneBins);
            setFormData(prev => ({ ...prev, toBinId: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const movementData = {
                productID: parseInt(formData.productId),
                quantity: parseInt(formData.quantity),
                warehouseID: parseInt(formData.warehouseId),
                toBinID: formData.toBinId || null
            };

            await stockMovementService.createStockIn(movementData);
            navigate('/import');
        } catch (error) {
            console.error("Failed to create import", error);
            alert("Failed to create import");
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Add Import (Stock In)</h5>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="productId" className="form-label">Product</label>
                                <select className="form-select" id="productId" value={formData.productId} onChange={handleChange} required>
                                    <option value="">Select Product</option>
                                    {products.map(p => (
                                        <option key={p.productID} value={p.productID}>{p.productName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="quantity" className="form-label">Quantity</label>
                                <input type="number" className="form-control" id="quantity" value={formData.quantity} onChange={handleChange} placeholder="Enter quantity" required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="warehouseId" className="form-label">To Warehouse</label>
                                <select
                                    className="form-select"
                                    id="warehouseId"
                                    value={formData.warehouseId}
                                    onChange={handleChange}
                                    required
                                    disabled={!isAdmin && !isGeneralManager}
                                >
                                    <option value="">Select Warehouse</option>
                                    {warehouses.map(w => (
                                        <option key={w.warehouseID} value={w.warehouseID}>{w.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="zoneId" className="form-label">Zone</label>
                                <select
                                    className="form-select"
                                    id="zoneId"
                                    value={formData.zoneId}
                                    onChange={handleChange}
                                    required
                                    disabled={!formData.warehouseId}
                                >
                                    <option value="">Select Zone</option>
                                    {filteredZones.map(z => (
                                        <option key={z.zoneID} value={z.zoneID}>{z.zoneName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="toBinId" className="form-label">To Bin (Optional)</label>
                                <select
                                    className="form-select"
                                    id="toBinId"
                                    value={formData.toBinId}
                                    onChange={handleChange}
                                    disabled={!formData.zoneId}
                                >
                                    <option value="">Select Bin</option>
                                    {filteredBins.map(b => {
                                        const status = binStatusMap[b.binCode] || { isFull: false, isBusy: false, usage: 0, capacity: b.capacity };
                                        let label = `${b.binCode} - ${b.binCode}`; // Backend doesn't have name, confusing. Using code.
                                        if (b.name) label = `${b.binCode} - ${b.name}`;

                                        // Status text
                                        let statusText = `(${status.usage}/${status.capacity})`;
                                        if (status.isFull) statusText += " [FULL]";
                                        else if (status.isBusy) statusText += " [Busy]";

                                        return (
                                            <option key={b.binCode} value={b.binCode} disabled={status.isFull} style={{ color: status.isFull ? 'red' : status.isBusy ? 'orange' : 'black' }}>
                                                {label} {statusText}
                                            </option>
                                        );
                                    })}
                                </select>
                                {!formData.warehouseId && <small className="text-muted d-block">Select warehouse first</small>}
                                {formData.warehouseId && !formData.zoneId && <small className="text-muted d-block">Select zone first</small>}
                            </div>
                            <button type="submit" className="btn btn-primary me-2">Save</button>
                            <Link to="/import" className="btn btn-secondary">Back</Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddImport;
