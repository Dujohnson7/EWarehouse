import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const EditExport = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/export');
    };

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Edit Export Product</h5>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="productName" className="form-label">Product Name</label>
                                <select className="form-select" id="productName" defaultValue="Product A">
                                    <option>Select Product</option>
                                    <option value="Product A">Product A</option>
                                    <option value="Product B">Product B</option>
                                    <option value="Product C">Product C</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exportQuantity" className="form-label">Quantity</label>
                                <input type="number" className="form-control" id="exportQuantity" defaultValue="50" required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exportWarehouse" className="form-label">Warehouse</label>
                                <select className="form-select" id="exportWarehouse" defaultValue="Main Warehouse">
                                    <option>Select Warehouse</option>
                                    <option value="Main Warehouse">Main Warehouse</option>
                                    <option value="Secondary Warehouse">Secondary Warehouse</option>
                                    <option value="Storage Warehouse">Storage Warehouse</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exportDate" className="form-label">Export Date</label>
                                <input type="date" className="form-control" id="exportDate" defaultValue="2024-01-10" required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exportNotes" className="form-label">Notes</label>
                                <textarea className="form-control" id="exportNotes" rows="3" defaultValue="Order fulfillment"></textarea>
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
