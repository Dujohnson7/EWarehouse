import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import stockMovementService from '../services/stockMovementService';
import productService from '../services/productService';
import warehouseService from '../services/warehouseService';
import binService from '../services/binService';
import authService from '../services/authService';

const AddTransferOut = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [bins, setBins] = useState([]);
    const [filteredBins, setFilteredBins] = useState([]);
    const isAdmin = authService.isAdmin();
    const isGeneralManager = authService.getUserRole() === 'General_Manager';
    const userWarehouseId = authService.getUserWarehouse();
    const [formData, setFormData] = useState({
        productId: '',
        quantity: '',
        fromWarehouseId: '',
        toWarehouseId: '',
        fromBinId: '',
        transferCode: '',
        reason: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, warehousesData, binsData] = await Promise.all([
                    productService.getAllProducts(),
                    warehouseService.getAllWarehouses(),
                    binService.getAllBins()
                ]);
                setProducts(productsData);
                setWarehouses(warehousesData);
                setBins(binsData);

                const timestamp = Math.floor(Date.now() / 1000);
                setFormData(prev => ({ ...prev, transferCode: `TRF-${timestamp}` }));

                if (!isAdmin && !isGeneralManager && userWarehouseId) {
                    setFormData(prev => ({ ...prev, fromWarehouseId: userWarehouseId }));
                    const filtered = binsData.filter(b => b.warehouseID === parseInt(userWarehouseId));
                    setFilteredBins(filtered);
                }
            } catch (error) {
                console.error("Failed to load dropdown data", error);
            }
        };
        fetchData();
    }, [isAdmin, isGeneralManager, userWarehouseId]);

    useEffect(() => {
        if (formData.fromWarehouseId) {
            const filtered = bins.filter(bin => bin.warehouseID === parseInt(formData.fromWarehouseId));
            setFilteredBins(filtered);
            if (formData.fromBinId && !filtered.find(b => b.binCode === formData.fromBinId)) {
                setFormData(prev => ({ ...prev, fromBinId: '' }));
            }
        } else {
            setFilteredBins([]);
            setFormData(prev => ({ ...prev, fromBinId: '' }));
        }
    }, [formData.fromWarehouseId, bins]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const transferData = {
                productID: parseInt(formData.productId),
                quantity: parseInt(formData.quantity),
                warehouseID_OUT: parseInt(formData.fromWarehouseId),
                warehouseID_IN: parseInt(formData.toWarehouseId),
                fromBinID: formData.fromBinId,
                transferCode: parseInt(formData.transferCode.replace('TRF-', '')),
                reason: formData.reason || null
            };

            await stockMovementService.createTransferOut(transferData);
            navigate('/transfer-out');
        } catch (error) {
            console.error("Failed to create transfer out", error);
            alert("Failed to create transfer out");
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Add Transfer Out</h5>
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
                                <label htmlFor="fromWarehouseId" className="form-label">From Warehouse</label>
                                <select
                                    className="form-select"
                                    id="fromWarehouseId"
                                    value={formData.fromWarehouseId}
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
                                <label htmlFor="fromBinId" className="form-label">From Bin</label>
                                <select className="form-select" id="fromBinId" value={formData.fromBinId} onChange={handleChange} required disabled={!formData.fromWarehouseId}>
                                    <option value="">Select Bin</option>
                                    {filteredBins.map(b => (
                                        <option key={b.binCode} value={b.binCode}>{b.binCode} - {b.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="toWarehouseId" className="form-label">To Warehouse</label>
                                <select className="form-select" id="toWarehouseId" value={formData.toWarehouseId} onChange={handleChange} required>
                                    <option value="">Select Destination Warehouse</option>
                                    {warehouses.map(w => (
                                        <option key={w.warehouseID} value={w.warehouseID}>{w.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="transferCode" className="form-label">Transfer Code</label>
                                <input type="text" className="form-control" id="transferCode" value={formData.transferCode} readOnly disabled />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="reason" className="form-label">Reason</label>
                                <textarea className="form-control" id="reason" value={formData.reason} onChange={handleChange} rows="3" placeholder="Enter reason"></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary me-2">Save</button>
                            <Link to="/transfer-out" className="btn btn-secondary">Back</Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTransferOut;
