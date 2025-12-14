import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import stockMovementService from '../services/stockMovementService';
import productService from '../services/productService';
import warehouseService from '../services/warehouseService';

const AddImport = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [formData, setFormData] = useState({
        productId: '',
        quantity: '',
        toWarehouseId: '',
        remarks: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, warehousesData] = await Promise.all([
                    productService.getAllProducts(),
                    warehouseService.getAllWarehouses()
                ]);
                setProducts(productsData);
                setWarehouses(warehousesData);
            } catch (error) {
                console.error("Failed to load dropdown data", error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const movementData = {
                productId: parseInt(formData.productId),
                quantity: parseInt(formData.quantity),
                toWarehouseId: parseInt(formData.toWarehouseId),
                remarks: formData.remarks
            };

            // Hardcoded UserID 1
            await stockMovementService.createStockIn(movementData, 1);
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
                                <label htmlFor="toWarehouseId" className="form-label">To Warehouse</label>
                                <select className="form-select" id="toWarehouseId" value={formData.toWarehouseId} onChange={handleChange} required>
                                    <option value="">Select Warehouse</option>
                                    {warehouses.map(w => (
                                        <option key={w.warehouseID} value={w.warehouseID}>{w.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="remarks" className="form-label">Remarks</label>
                                <textarea className="form-control" id="remarks" value={formData.remarks} onChange={handleChange} rows="3" placeholder="Enter notes"></textarea>
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
