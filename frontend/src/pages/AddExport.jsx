import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import stockMovementService from '../services/stockMovementService';
import productService from '../services/productService';
import warehouseService from '../services/warehouseService';
import binService from '../services/binService';
import productLocationService from '../services/productLocationService'; // Add this
import authService from '../services/authService';

const AddExport = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [bins, setBins] = useState([]);
    const [filteredBins, setFilteredBins] = useState([]);
    const [productLocations, setProductLocations] = useState([]); // Store locs
    const [availableStock, setAvailableStock] = useState(0); // Track max stock
    const [error, setError] = useState(''); // Validation error
    const isAdmin = authService.isAdmin();
    const isGeneralManager = authService.getUserRole() === 'General_Manager';
    const userWarehouseId = authService.getUserWarehouse();
    const [formData, setFormData] = useState({
        productId: '',
        quantity: '',
        warehouseId: '',
        fromBinId: '',
        reason: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, warehousesData, binsData, locationsData] = await Promise.all([
                    productService.getAllProducts(),
                    warehouseService.getAllWarehouses(),
                    binService.getAllBins(),
                    productLocationService.getAllProductLocations()
                ]);
                setProducts(productsData);
                setWarehouses(warehousesData);
                setBins(binsData);
                setProductLocations(locationsData);

                if (!isAdmin && !isGeneralManager && userWarehouseId) {
                    setFormData(prev => ({ ...prev, warehouseId: userWarehouseId }));
                    // The initial filtering for bins based on user's warehouse will now be handled by the new useEffect below
                }
            } catch (error) {
                console.error("Failed to load dropdown data", error);
            }
        };
        fetchData();
    }, [isAdmin, isGeneralManager, userWarehouseId]);

    useEffect(() => {
        // Advanced Filter: Warehouse AND Product
        if (formData.warehouseId && formData.productId) {
            const warehouseID = parseInt(formData.warehouseId);
            const productID = parseInt(formData.productId);
 
            const warehouseBins = bins.filter(b => b.warehouseID === warehouseID);
 
            const productLocs = productLocations.filter(loc => loc.productID === productID);
 
            const relevantBins = warehouseBins.filter(bin => { 
                const loc = productLocs.find(pl => (pl.binID || pl.binId || pl.BinID) === bin.binCode);
                return loc && loc.quantity > 0;
            }).map(bin => {
                const loc = productLocs.find(pl => (pl.binID || pl.binId || pl.BinID) === bin.binCode);
                return {
                    ...bin,
                    currentStock: loc ? loc.quantity : 0
                };
            });

            setFilteredBins(relevantBins);

            if (formData.fromBinId && !relevantBins.find(b => b.binCode === formData.fromBinId)) {
                setFormData(prev => ({ ...prev, fromBinId: '' }));
                setAvailableStock(0);
            }
        } else {
            setFilteredBins([]);
            setFormData(prev => ({ ...prev, fromBinId: '' }));
            setAvailableStock(0);
        }
    }, [formData.warehouseId, formData.productId, bins, productLocations]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        setError('');  

        if (id === 'fromBinId') {
            const selectedBin = filteredBins.find(b => b.binCode === value);
            setAvailableStock(selectedBin ? selectedBin.currentStock : 0);
            if (formData.quantity && selectedBin) {
                if (parseInt(formData.quantity) > selectedBin.currentStock) {
                    setError(`Error: Quantity exceeds available stock (${selectedBin.currentStock})`);
                }
            }
        }

        if (id === 'quantity') {
            const qty = parseInt(value);
            if (availableStock > 0 && qty > availableStock) {
                setError(`Error: Quantity exceeds available stock (${availableStock})`);
            }
        }

        if (id === 'warehouseId') {
            setFormData(prev => ({ ...prev, fromBinId: '' }));
            setAvailableStock(0);
        }
        if (id === 'productId') {
            setFormData(prev => ({ ...prev, fromBinId: '' }));
            setAvailableStock(0);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (error) {
            alert("Please fix validation errors before submitting.");
            return;
        }
        if (parseInt(formData.quantity) > availableStock) {
            setError(`Error: Quantity exceeds available stock (${availableStock})`);
            return;
        }
        try {
            const movementData = {
                productID: parseInt(formData.productId),
                quantity: parseInt(formData.quantity),
                warehouseID: parseInt(formData.warehouseId),
                fromBinID: formData.fromBinId || null,
                reason: formData.reason || null
            };

            await stockMovementService.createStockOut(movementData);
            navigate('/export');
        } catch (error) {
            console.error("Failed to create export", error);
            alert("Failed to create export");
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Add Export (Stock Out)</h5>
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
                                <label htmlFor="warehouseId" className="form-label">From Warehouse</label>
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
                                <label htmlFor="fromBinId" className="form-label">From Bin (Optional)</label>
                                <select
                                    className="form-select"
                                    id="fromBinId"
                                    value={formData.fromBinId}
                                    onChange={handleChange}
                                    disabled={!formData.warehouseId || !formData.productId}
                                >
                                    <option value="">Select Bin</option>
                                    {filteredBins.map(b => (
                                        <option key={b.binCode} value={b.binCode}>{b.binCode} - {b.name}</option>
                                    ))}
                                </select>
                                {!formData.warehouseId && <small className="text-muted">Select warehouse first</small>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="quantity" className="form-label">Quantity</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    placeholder="Enter quantity"
                                    required
                                    min="1"
                                    max={availableStock > 0 ? availableStock : undefined}
                                />
                                {availableStock > 0 && <small className="text-muted">Available: {availableStock}</small>}
                                {error && <div className="text-danger mt-1">{error}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="reason" className="form-label">Reason</label>
                                <textarea className="form-control" id="reason" value={formData.reason} onChange={handleChange} rows="3" placeholder="Enter reason"></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary me-2">Save</button>
                            <Link to="/export" className="btn btn-secondary">Back</Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddExport;
