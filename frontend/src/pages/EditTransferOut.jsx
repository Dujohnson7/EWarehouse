import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import stockMovementService from '../services/stockMovementService';
import productService from '../services/productService';
import warehouseService from '../services/warehouseService';
import binService from '../services/binService';

const EditTransferOut = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
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
                    quantity: movementData.quantity || '',
                    fromWarehouseId: movementData.warehouseID || '',
                    fromBinId: movementData.fromBinID || '',
                    transferCode: movementData.transferCode || '',
                    remarks: movementData.remarks || ''
                });

                setLoading(false);
            } catch (error) {
                console.error("Failed to load transfer data", error);
                alert("Failed to load transfer data");
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Filter bins when warehouse changes
    useEffect(() => {
        if (formData.fromWarehouseId) {
            const filtered = bins.filter(bin => bin.warehouseID === parseInt(formData.fromWarehouseId));
            setFilteredBins(filtered);
        } else {
            setFilteredBins([]);
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

            await stockMovementService.updateTransferOut(id, transferData);
            navigate('/transfer-out');
        } catch (error) {
            console.error("Failed to update transfer out", error);
            alert("Failed to update transfer out");
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
                <h5 className="card-title fw-semibold mb-4">Edit Transfer Out</h5>
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
                                <input type="text" className="form-control" id="transferCode" value={formData.transferCode} onChange={handleChange} disabled />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="remarks" className="form-label">Remarks</label>
                                <textarea className="form-control" id="remarks" value={formData.remarks} onChange={handleChange} rows="3" placeholder="Enter notes"></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary me-2">Update</button>
                            <Link to="/transfer-out" className="btn btn-secondary">Back</Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditTransferOut;
