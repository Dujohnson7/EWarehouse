import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import stockMovementService from '../services/stockMovementService';
import productService from '../services/productService';
import warehouseService from '../services/warehouseService';
import binService from '../services/binService';

const EditExport = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [bins, setBins] = useState([]); // Keep this to store all bins
    // const [filteredBins, setFilteredBins] = useState([]); // Remove this, as it's computed dynamically
    const isAdmin = authService.isAdmin();
    const isGeneralManager = authService.getUserRole() === 'General_Manager';
    const userWarehouseId = authService.getUserWarehouse();

    const [formData, setFormData] = useState({
        exportDate: '',
        warehouseId: '',
        customer: '',
        fromBinId: '',
        reason: '',
        exportDetails: [
            { productId: '', quantity: 1, unitPrice: 0 }
        ]
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

                const exportData = await stockMovementService.getStockMovementById(id);
                setFormData(prev => ({
                    ...prev,
                    exportDate: exportData.movementDate.split('T')[0],
                    warehouseId: isAdmin ? exportData.warehouseID : userWarehouseId,
                    customer: exportData.customer || '',
                    fromBinId: exportData.fromBinID || '',
                    reason: exportData.reason || '',
                    exportDetails: [
                        {
                            productId: exportData.productID,
                            quantity: exportData.quantity,
                            unitPrice: 0
                        }
                    ]
                }));

                setLoading(false);
            } catch (error) {
                console.error("Failed to load data", error);
                alert("Failed to load export data");
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isAdmin, userWarehouseId]);

    const filteredBins = bins.filter(bin =>
        bin.warehouseID === parseInt(formData.warehouseId)
    );

    const handleChange = (e) => {
        const { id, value, name } = e.target;
        const field = name || id;

        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const movementData = {
                newQuantity: parseInt(formData.quantity) || 0,
                fromBinID: formData.fromBinId || null,
                reason: formData.reason || null
            };

            await stockMovementService.updateStockOut(id, movementData);
            navigate('/export');
        } catch (error) {
            console.error("Failed to update export", error);
            alert("Failed to update export");
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
                <h5 className="card-title fw-semibold mb-4">Edit Export (Stock Out)</h5>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="productId" className="form-label">Product</label>
                                <select className="form-select" id="productId" name="productId" value={formData.exportDetails[0].productId} disabled>
                                    <option value="">Select Product</option>
                                    {products.map(p => (
                                        <option key={p.productID} value={p.productID}>{p.productName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="quantity" className="form-label">Quantity</label>
                                <input type="number" className="form-control" id="quantity" name="quantity" value={formData.exportDetails[0].quantity} onChange={(e) => {
                                    const newQuantity = e.target.value;
                                    setFormData(prev => ({
                                        ...prev,
                                        exportDetails: [{ ...prev.exportDetails[0], quantity: newQuantity }]
                                    }));
                                }} placeholder="Enter quantity" required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="warehouseId" className="form-label">From Warehouse</label>
                                <select
                                    className="form-select"
                                    id="warehouseId"
                                    name="warehouseId"
                                    value={formData.warehouseId}
                                    onChange={handleChange}
                                    required
                                    disabled={!isAdmin && userWarehouseId}
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
                                    name="fromBinId"
                                    value={formData.fromBinId}
                                    onChange={handleChange}
                                    disabled={!formData.warehouseId}
                                >
                                    <option value="">Select Bin</option>
                                    {filteredBins.map(b => (
                                        <option key={b.binCode} value={b.binCode}>{b.binCode} - {b.name}</option>
                                    ))}
                                </select>
                                {!formData.warehouseId && <small className="text-muted">Select warehouse first</small>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="reason" className="form-label">Reason</label>
                                <textarea className="form-control" id="reason" name="reason" value={formData.reason} onChange={handleChange} rows="3" placeholder="Enter reason"></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary me-2">Update</button>
                            <Link to="/export" className="btn btn-secondary">Back</Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditExport;
