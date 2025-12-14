import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productLocationService from '../services/productLocationService';
import productService from '../services/productService';
import binService from '../services/binService';

const AddProductLocation = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [bins, setBins] = useState([]);
    const [formData, setFormData] = useState({
        productID: '',
        binID: '',
        quantity: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, binsData] = await Promise.all([
                    productService.getAllProducts(),
                    binService.getAllBins()
                ]);
                setProducts(productsData);
                setBins(binsData);
            } catch (error) {
                console.error("Failed to load data", error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const locationData = {
                productID: parseInt(formData.productID),
                binID: formData.binID,
                quantity: parseInt(formData.quantity)
            };

            await productLocationService.createLocation(locationData);
            navigate('/product-locations');
        } catch (error) {
            console.error("Failed to create product location", error);
            alert("Failed to create product location");
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Add Product Location</h5>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="productID" className="form-label">Product</label>
                                <select className="form-select" id="productID" value={formData.productID} onChange={handleChange} required>
                                    <option value="">Select Product</option>
                                    {products.map(p => (
                                        <option key={p.productID} value={p.productID}>{p.productName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="binID" className="form-label">Bin</label>
                                <select className="form-select" id="binID" value={formData.binID} onChange={handleChange} required>
                                    <option value="">Select Bin</option>
                                    {bins.map(b => (
                                        <option key={b.binID} value={b.binID}>{b.binCode}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="quantity" className="form-label">Quantity</label>
                                <input type="number" className="form-control" id="quantity" value={formData.quantity} onChange={handleChange} min="0" required />
                            </div>
                            <button type="submit" className="btn btn-primary me-2">Save</button>
                            <Link to="/product-locations" className="btn btn-secondary">Back</Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProductLocation;
