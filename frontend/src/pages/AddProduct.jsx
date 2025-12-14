import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import categoryService from '../services/categoryService';

const AddProduct = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        productName: '',
        sku: '',
        categoryID: '',
        price: '',
        description: '',
        image: ''
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAllCategories();
                setCategories(data);
            } catch (error) {
                console.error("Failed to load categories", error);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // For now, handling image as string/url. File upload logic would need backend support (multipart/form-data).
    // The current backend DTO accepts 'Image' as string (nvarchar).
    const handleImageChange = (e) => {
        // Placeholder for file handling - maybe converting to Base64 or just filename
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
                productName: formData.productName,
                sku: formData.sku,
                categoryID: parseInt(formData.categoryID),
                price: parseFloat(formData.price),
                description: formData.description,
                image: formData.image || ''
            };

            // Hardcoded UserID 1
            await productService.createProduct(productData, 1);
            navigate('/products');
        } catch (error) {
            console.error("Failed to create product", error);
            alert("Failed to create product");
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Add Product</h5>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="productName" className="form-label">Product Name</label>
                            <input type="text" className="form-control" id="productName" name="productName" onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="sku" className="form-label">SKU</label>
                            <input type="text" className="form-control" id="sku" name="sku" onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="categoryID" className="form-label">Category</label>
                            <select className="form-select" id="categoryID" name="categoryID" onChange={handleChange} required>
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.categoryID} value={cat.categoryID}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="price" className="form-label">Price</label>
                            <input type="number" className="form-control" id="price" name="price" step="0.01" onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea className="form-control" id="description" name="description" rows="3" onChange={handleChange}></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="image" className="form-label">Product Image</label>
                        <input className="form-control" type="file" id="image" name="image" onChange={handleImageChange} />
                    </div>
                    <button type="submit" className="btn btn-primary me-2">Save</button>
                    <Link to="/products" className="btn btn-secondary">Back</Link>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
