import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import categoryService from '../services/categoryService';

const EditCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isActive: true
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const data = await categoryService.getCategoryById(id);
                if (data) {
                    setFormData({
                        name: data.name,
                        description: data.description || '',
                        isActive: data.isActive
                    });
                }
            } catch (error) {
                console.error("Failed to fetch category", error);
                alert("Failed to load category data");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCategory();
    }, [id]);

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id === 'categoryName' ? 'name' : (id === 'categoryDescription' ? 'description' : id)]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Hardcoded UserID 1 for now
            await categoryService.updateCategory(id, formData, 1);
            navigate('/categories');
        } catch (error) {
            console.error("Failed to update category", error);
            alert("Failed to update category");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Edit Category</h5>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="categoryName" className="form-label">Category Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="categoryName"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="categoryDescription" className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    id="categoryDescription"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                            <div className="mb-3 form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label" htmlFor="isActive">Active</label>
                            </div>
                            <button type="submit" className="btn btn-primary me-2">Update</button>
                            <Link to="/categories" className="btn btn-secondary">Back</Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCategory;
