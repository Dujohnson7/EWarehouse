import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TablePagination from '../components/TablePagination';
import productService from '../services/productService';
import categoryService from '../services/categoryService';

const Products = () => {
    // State
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, categoriesData] = await Promise.all([
                    productService.getAllProducts(),
                    categoryService.getAllCategories()
                ]);
                setProducts(productsData);
                setCategories(categoriesData);
            } catch (error) {
                console.error("Failed to load products/categories", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Delete Function
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                // Hardcoded UserID 1 for now
                await productService.deleteProduct(id, 1);
                // Refresh list
                const data = await productService.getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error("Failed to delete product", error);
                alert("Failed to delete product");
            }
        }
    };

    // Logic
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.category?.name || 'Unknown').toLowerCase().includes(searchTerm.toLowerCase());

        const productCatId = product.categoryID;
        const matchesCategory = selectedCategory === 'All' || productCatId === parseInt(selectedCategory);

        return matchesSearch && matchesCategory;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Product Management</h5>

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
                            <div className="col-md-4 col-xl-3 mt-3 mt-md-0">
                                <select
                                    className="form-select"
                                    value={selectedCategory}
                                    onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                                >
                                    <option value="All">All Categories</option>
                                    {categories.map(cat => (
                                        <option key={cat.categoryID} value={cat.categoryID}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4 col-xl-6 text-end d-flex justify-content-md-end justify-content-center mt-3 mt-md-0">
                                <Link to="/products/add" className="btn btn-primary d-flex align-items-center">
                                    <i className="ti ti-plus text-white me-1 fs-5"></i> Add Product
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="card card-body">
                        <div className="table-responsive">
                            <table className="table search-table align-middle text-nowrap">
                                <thead className="header-item">
                                    <tr>
                                        <th>Product</th>
                                        <th>Name</th>
                                        <th>SKU</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="7" className="text-center">Loading...</td></tr>
                                    ) : currentItems.length > 0 ? (
                                        currentItems.map((product) => (
                                            <tr key={product.productID} className="search-items">
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="ms-3">
                                                            <div className="user-meta-info">
                                                                <h6 className="user-name mb-0" data-name={product.productID}>{product.productID}</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><span className="usr-product-name">{product.productName}</span></td>
                                                <td><span className="usr-product-sku">{product.sku}</span></td>
                                                <td><span className="usr-product-category">{product.category ? product.category.name : 'N/A'}</span></td>
                                                <td><span className="usr-product-price">{product.price} RF</span></td>
                                                <td>
                                                    <span className={`badge ${product.isActive ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                                                        {product.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-btn">
                                                        <Link to={`/products/edit/${product.productID}`} className="text-primary edit">
                                                            <i className="ti ti-edit fs-5"></i>
                                                        </Link>
                                                        <button
                                                            className="btn btn-link text-dark delete ms-2 p-0"
                                                            onClick={() => handleDelete(product.productID)}
                                                        >
                                                            <i className="ti ti-trash fs-5"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center">No products found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

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

export default Products;
