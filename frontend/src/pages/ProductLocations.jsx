import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productLocationService from '../services/productLocationService';
import TablePagination from '../components/TablePagination';
import PermissionGate from '../components/PermissionGate';

const ProductLocations = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const data = await productLocationService.getAllProductLocations();
            setLocations(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch product locations", error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this location entry?")) {
            try {
                await productLocationService.deleteLocation(id);
                fetchLocations();
            } catch (error) {
                console.error("Failed to delete location", error);
            }
        }
    };

    // Filter and Pagination
    const filteredLocations = locations.filter(loc => {
        const productName = loc.productName || '';
        const binCode = loc.binCode || '';

        const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            binCode.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredLocations.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="card">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="card-title fw-semibold">Product Locations</h5>
                    <PermissionGate type="insert">
                        <Link to="/product-locations/add" className="btn btn-primary">Add Product Location</Link>
                    </PermissionGate>
                </div>

                <div className="card card-body">
                    <div className="row">
                        <div className="col-md-4 col-xl-3">
                            <form className="position-relative" onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="text"
                                    className="form-control product-search ps-5"
                                    id="input-search"
                                    placeholder="Search Locations..."
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                />
                                <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3"></i>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="card card-body">
                    <div className="table-responsive">
                        <table className="table search-table align-middle text-nowrap">
                            <thead className="header-item">
                                <tr>
                                    <th>Location ID</th>
                                    <th>Product Name</th>
                                    <th>Bin Code</th>
                                    <th>Quantity</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center">Loading...</td></tr>
                                ) : currentItems.length > 0 ? (
                                    currentItems.map((loc) => (
                                        <tr key={loc.productLocationID} className="search-items">
                                            <td><span className="usr-location-id">{loc.productLocationID}</span></td>
                                            <td><span className="usr-product-name">{loc.product?.productName || 'N/A'}</span></td>
                                            <td><span className="usr-bin-code">{loc.bin?.binCode || 'N/A'}</span></td>
                                            <td><span className="usr-quantity">{loc.quantity}</span></td>
                                            <td>
                                                <div className="action-btn">
                                                    <PermissionGate type="update">
                                                        <Link to={`/product-locations/edit/${loc.productLocationID}`} className="text-info edit">
                                                            <i className="ti ti-eye fs-5"></i>
                                                        </Link>
                                                    </PermissionGate>
                                                    <PermissionGate type="delete">
                                                        <a href="javascript:void(0)" className="text-dark delete ms-2" onClick={() => handleDelete(loc.productLocationID)}>
                                                            <i className="ti ti-trash fs-5"></i>
                                                        </a>
                                                    </PermissionGate>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">No locations found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <TablePagination
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={filteredLocations.length}
                        paginate={paginate}
                        setItemsPerPage={setItemsPerPage}
                    />
                </div>
            </div>
        </div>
    );
};


export default ProductLocations;
