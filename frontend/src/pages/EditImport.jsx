import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const EditImport = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/import');
    };

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Edit Import Product</h5>
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
                                <label htmlFor="importQuantity" className="form-label">Quantity</label>
                                <input type="number" className="form-control" id="importQuantity" defaultValue="100" required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="importWarehouse" className="form-label">Warehouse</label>
                                <select className="form-select" id="importWarehouse" defaultValue="Main Warehouse">
                                    <option>Select Warehouse</option>
                                    <option value="Main Warehouse">Main Warehouse</option>
                                    <option value="Secondary Warehouse">Secondary Warehouse</option>
                                    <option value="Storage Warehouse">Storage Warehouse</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="importDate" className="form-label">Import Date</label>
                                <input type="date" className="form-control" id="importDate" defaultValue="2024-01-15" required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="importNotes" className="form-label">Notes</label>
                                <textarea className="form-control" id="importNotes" rows="3" defaultValue="Initial stock import"></textarea>
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
