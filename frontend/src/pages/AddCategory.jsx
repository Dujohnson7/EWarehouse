import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import categoryService from '../services/categoryService';

const AddCategory = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Hardcoded UserID 1 for now
            await categoryService.createCategory({ name, description }, 1);
            navigate('/categories');
        } catch (error) {
            console.error("Failed to create category", error);
            alert("Failed to create category");
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Add Category</h5>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="categoryName" className="form-label">Category Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="categoryName"
                                    placeholder="Enter category name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="categoryDescription" className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    id="categoryDescription"
                                    rows="3"
                                    placeholder="Enter description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary me-2">Save</button>
                            <Link to="/categories" className="btn btn-secondary">Back</Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCategory;
