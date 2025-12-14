import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import stockMovementService from '../services/stockMovementService';
import productService from '../services/productService';
import warehouseService from '../services/warehouseService';
import binService from '../services/binService';

const EditAdjust = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [bins, setBins] = useState([]);
    const [filteredBins, setFilteredBins] = useState([]);
    const [formData, setFormData] = useState({
        productId: '',
        warehouseId: '',
        binId: '',
        quantity: '',
        reason: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [movementData, productsData, warehousesData, binsData] = await Promise.all([
                    stockMovementService.getMovementById(id),
                    productService.getAllProducts(),
                    warehouseService.getAllWarehouses(),
                    binService.getAllBins()
                ]);

                setProducts(productsData);
                setWarehouses(warehousesData);
                setBins(binsData);

                // Populate form with existing data
                setFormData({
                    productId: movementData.productID || '',
                    warehouseId: movementData.warehouseID || '',
                    binId: movementData.binID || '',
                    quantity: movementData.quantity || '',
                    reason: movementData.reason || ''
                });

                setLoading(false);
            } catch (error) {
                console.error("Failed to load adjustment data", error);
                alert("Failed to load adjustment data");
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Filter bins when warehouse changes
    useEffect(() => {
        if (formData.warehouseId) {
            const filtered = bins.filter(bin => bin.warehouseID === parseInt(formData.warehouseId));
            setFilteredBins(filtered);
        } else {
            setFilteredBins([]);
        }
    }, [formData.warehouseId, bins]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const adjustData = {
                productId: parseInt(formData.productId),
                warehouseId: parseInt(formData.warehouseId),
                binId: formData.binId,
                quantity: parseInt(formData.quantity),
                reason: formData.reason
            };

            await stockMovementService.updateStockAdjust(id, adjustData);
            navigate('/adjust');
        } catch (error) {
            console.error("Failed to update adjustment", error);
            alert("Failed to update adjustment");
        }
    };

    if (loading) {
        return (
            <div className="card">
                <div className="card-body">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Edit Stock Adjustment</h5>
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
                                <label htmlFor="warehouseId" className="form-label">Warehouse</label>
                                <select className="form-select" id="warehouseId" value={formData.warehouseId} onChange={handleChange} required>
                                    <option value="">Select Warehouse</option>
                                    {warehouses.map(w => (
                                        <option key={w.warehouseID} value={w.warehouseID}>{w.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="binId" className="form-label">Bin</label>
                                <select className="form-select" id="binId" value={formData.binId} onChange={handleChange} required disabled={!formData.warehouseId}>
                                    <option value="">Select Bin</option>
                                    {filteredBins.map(b => (
                                        <option key={b.binCode} value={b.binCode}>{b.binCode} - {b.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="quantity" className="form-label">Quantity Adjustment</label>
                                <input type="number" className="form-control" id="quantity" value={formData.quantity} onChange={handleChange} placeholder="Enter quantity (use negative for reduction)" required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="reason" className="form-label">Reason</label>
                                <textarea className="form-control" id="reason" value={formData.reason} onChange={handleChange} rows="3" placeholder="Enter reason for adjustment" required></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary me-2">Update</button>
                            <Link to="/adjust" className="btn btn-secondary">Back</Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditAdjust;
