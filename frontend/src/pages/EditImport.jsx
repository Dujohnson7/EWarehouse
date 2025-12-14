import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import stockMovementService from '../services/stockMovementService';
import productService from '../services/productService';
import warehouseService from '../services/warehouseService';
import binService from '../services/binService';

const EditImport = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
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
        warehouseId: '',
        toBinId: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [movement, productsData, warehousesData, binsData] = await Promise.all([
                    stockMovementService.getMovementById(id),
                    productService.getAllProducts(),
                    warehouseService.getAllWarehouses(),
                    binService.getAllBins()
                ]);

                let initialWarehouseId = movement.warehouseID;
                if (!isAdmin && userWarehouseId && userWarehouseId !== movement.warehouseID) {
                } else if (!isAdmin && userWarehouseId) {
                    initialWarehouseId = userWarehouseId;
                }


                setFormData({
                    productId: movement.productID,
                    quantity: movement.quantity,
                    warehouseId: initialWarehouseId,
                    toBinId: movement.toBinID || ''
                });
                setProducts(productsData);
                setWarehouses(warehousesData);
                setBins(binsData);

                if (!isAdmin && !isGeneralManager && userWarehouseId) {
                    // Force warehouse ID if not admin/gm
                    setFormData(prev => ({ ...prev, warehouseId: userWarehouseId }));
                    const filtered = binsData.filter(b => b.warehouseID === parseInt(userWarehouseId));
                    setFilteredBins(filtered);
                } else if (movement.warehouseID) { // Changed 'data.warehouseID' to 'movement.warehouseID'
                    // Initial load filter
                    const filtered = binsData.filter(b => b.warehouseID === movement.warehouseID);
                    setFilteredBins(filtered);
                }
                setLoading(false);
            } catch (error) {
                console.error("Failed to load import data", error);
                alert("Failed to load import data");
                setLoading(false);
            }
        };
        fetchData();
    }, [id, isAdmin, userWarehouseId, isGeneralManager]);  // Added isGeneralManager to dependency array

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));

        if (id === 'warehouseId') {
            const filtered = bins.filter(b => b.warehouseID === parseInt(value));
            setFilteredBins(filtered);
            setFormData(prev => ({ ...prev, toBinId: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const movementData = {
                newQuantity: parseInt(formData.quantity),
                toBinID: formData.toBinId || null
            };

            await stockMovementService.updateStockIn(id, movementData);
            navigate('/import');
        } catch (error) {
            console.error("Failed to update import", error);
            alert("Failed to update import");
        }
    };

    if (loading) {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="text-center">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Edit Import (Stock In)</h5>
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
                                <label htmlFor="warehouseId" className="form-label">Warehouse</label>
                                <select className="form-select" id="warehouseId" value={formData.warehouseId} onChange={handleChange} required>
                                    <option value="">Select Warehouse</option>
                                    {warehouses.map(w => (
                                        <option key={w.warehouseID} value={w.warehouseID}>{w.name}</option>
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
                                    required
                                    disabled={!isAdmin && !isGeneralManager}
                                >    <option value="">Select Bin</option>
                                    {filteredBins.map(b => (
                                        <option key={b.binCode} value={b.binCode}>{b.binCode} - {b.name}</option>
                                    ))}
                                </select>
                                {!formData.warehouseId && <small className="text-muted">Select warehouse first</small>}
                            </div>
                            <button type="submit" className="btn btn-primary me-2">Update</button>
                            <Link to="/import" className="btn btn-secondary">Back</Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditImport;
