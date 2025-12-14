import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import productService from '../services/productService';
import categoryService from '../services/categoryService';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        productName: '',
        sku: '',
        categoryID: '',
        price: '',
        description: '',
        image: '',
        isActive: true
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [product, cats] = await Promise.all([
                    productService.getProductById(id),
                    categoryService.getAllCategories()
                ]);

                if (product) {
                    setFormData({
                        productName: product.productName,
                        sku: product.sku,
                        categoryID: product.categoryID,
                        price: product.price,
                        description: product.description || '',
                        image: product.image || '',
                        isActive: product.isActive
                    });
                }
                setCategories(cats);
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file.name }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                ...formData,
                categoryID: parseInt(formData.categoryID),
                price: parseFloat(formData.price)
            };

            // Hardcoded UserID 1
            await productService.updateProduct(id, productData, 1);
            navigate('/products');
        } catch (error) {
            console.error("Failed to update product", error);
            alert("Failed to update product");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Edit Product</h5>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="productName" className="form-label">Product Name</label>
                            <input type="text" className="form-control" id="productName" name="productName" value={formData.productName} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="sku" className="form-label">SKU</label>
                            <input type="text" className="form-control" id="sku" name="sku" value={formData.sku} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="categoryID" className="form-label">Category</label>
                            <select className="form-select" id="categoryID" name="categoryID" value={formData.categoryID} onChange={handleChange} required>
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.categoryID} value={cat.categoryID}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="price" className="form-label">Price</label>
                            <input type="number" className="form-control" id="price" name="price" step="0.01" value={formData.price} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea className="form-control" id="description" name="description" rows="3" value={formData.description} onChange={handleChange}></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="image" className="form-label">Product Image</label>
                        <input className="form-control" type="file" id="image" name="image" onChange={handleImageChange} />
                        <small className="text-muted">Current: {formData.image}</small>
                    </div>
                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="isActive"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="isActive">Active</label>
                    </div>
                    <button type="submit" className="btn btn-primary me-2">Update</button>
                    <Link to="/products" className="btn btn-secondary">Back</Link>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
