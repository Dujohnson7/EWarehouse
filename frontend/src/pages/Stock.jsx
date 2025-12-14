import React, { useState, useEffect } from 'react';
import TablePagination from '../components/TablePagination';
import stockStatusService from '../services/stockStatusService';

const Stock = () => {
    // State
    const [stocks, setStocks] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);

    // Fetch Data
    useEffect(() => {
        const fetchStockStatus = async () => {
            try {
                const data = await stockStatusService.getAllStockStatuses();
                setStocks(data);
            } catch (error) {
                console.error("Failed to load stock status", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStockStatus();
    }, []);

    // Logic
    const filteredProducts = stocks.filter(p => {
        const status = p.status || '';  
        const productName = p.productName || '';
        const category = p.categoryName || '';

        const matchesStatus = statusFilter ? status === statusFilter : true;
        const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'In Stock': return 'bg-success-subtle text-success';
            case 'Low Stock': return 'bg-warning-subtle text-warning';
            case 'Out of Stock': return 'bg-danger-subtle text-danger';
            default: return 'bg-primary-subtle text-primary';
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Stock Management</h5>

                <div className="widget-content searchable-container list">
                    <div className="card card-body">
                        <div className="row">
                            <div className="col-md-4 col-xl-3">
                                <form className="position-relative" onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        type="text"
                                        className="form-control product-search ps-5"
                                        id="input-search"
                                        placeholder="Search Products..."
                                        value={searchTerm}
                                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                    />
                                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3"></i>
                                </form>
                            </div>
                            <div className="col-md-8 col-xl-9 text-end d-flex justify-content-md-end justify-content-center mt-3 mt-md-0">
                                <div className="d-flex gap-2">
                                    <select
                                        className="form-select form-select-sm"
                                        id="statusFilter"
                                        style={{ width: 'auto' }}
                                        value={statusFilter}
                                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                                    >
                                        <option value="">All Status</option>
                                        <option value="In Stock">In Stock</option>
                                        <option value="Low Stock">Low Stock</option>
                                        <option value="Out of Stock">Out of Stock</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card card-body">
                        <div className="table-responsive">
                            <table className="table search-table align-middle text-nowrap">
                                <thead className="header-item">
                                    <tr>
                                        <th>Product ID</th>
                                        <th>Product Name</th>
                                        <th>Category</th>
                                        <th>Total Quantity</th>
                                        <th>Stock Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="5" className="text-center">Loading...</td></tr>
                                    ) : currentItems.length > 0 ? (
                                        currentItems.map((product, index) => (
                                            <tr key={index} className="search-items">
                                                <td><span className="usr-product-id">{product.productID}</span></td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="ms-2">
                                                            <div className="user-meta-info">
                                                                <h6 className="user-name mb-0" data-name={product.productName}>{product.product.productName}</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><span className="usr-product-category">{product.product.categoryName}</span></td>
                                                <td><span className="usr-product-quantity">{product.quantity}</span></td>
                                                <td>
                                                    <span className={`badge ${getStatusBadgeClass(product.stockLevel)}`}>{product.stockLevel}</span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center">No products found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        <TablePagination
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredProducts.length}
                            paginate={paginate}
                            setItemsPerPage={setItemsPerPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Stock;
