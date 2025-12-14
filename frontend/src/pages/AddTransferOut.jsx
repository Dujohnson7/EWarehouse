import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import stockMovementService from '../services/stockMovementService';
import productService from '../services/productService';
import warehouseService from '../services/warehouseService';
import binService from '../services/binService';

const AddTransferOut = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [bins, setBins] = useState([]);
    const [filteredBins, setFilteredBins] = useState([]);
    const [formData, setFormData] = useState({
        productId: '',
        quantity: '',
        fromWarehouseId: '',
        fromBinId: '',
        transferCode: '',
        remarks: ''
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

                // Auto-generate transfer code
                const timestamp = Date.now();
                setFormData(prev => ({ ...prev, transferCode: `TRF-${timestamp}` }));
            } catch (error) {
                console.error("Failed to load dropdown data", error);
            }
        };
        fetchData();
    }, []);

    // Filter bins when warehouse changes
    useEffect(() => {
        if (formData.fromWarehouseId) {
            const filtered = bins.filter(bin => bin.warehouseID === parseInt(formData.fromWarehouseId));
            setFilteredBins(filtered);
            // Reset bin selection if current bin not in filtered list
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
                productId: parseInt(formData.productId),
                quantity: parseInt(formData.quantity),
                warehouseId: parseInt(formData.fromWarehouseId),
                fromBinId: formData.fromBinId,
                transferCode: formData.transferCode,
                remarks: formData.remarks
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
                                <select className="form-select" id="fromWarehouseId" value={formData.fromWarehouseId} onChange={handleChange} required>
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
                                <label htmlFor="transferCode" className="form-label">Transfer Code</label>
                                <input type="text" className="form-control" id="transferCode" value={formData.transferCode} onChange={handleChange} placeholder="Auto-generated" required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="remarks" className="form-label">Remarks</label>
                                <textarea className="form-control" id="remarks" value={formData.remarks} onChange={handleChange} rows="3" placeholder="Enter notes"></textarea>
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
