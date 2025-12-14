import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import warehouseService from '../services/warehouseService';
import userService from '../services/userService';
import binService from '../services/binService';

const Header = ({ onSidebarToggle }) => {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const toggleNotification = (e) => {
        e.preventDefault();
        setIsNotificationOpen(!isNotificationOpen);
        setIsProfileOpen(false);
    };

    const toggleProfile = (e) => {
        e.preventDefault();
        setIsProfileOpen(!isProfileOpen);
        setIsNotificationOpen(false);
    };

    // Keyboard shortcut: Ctrl+K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('input[placeholder="Search... (Ctrl+K)"]');
                if (searchInput) {
                    searchInput.focus();
                }
            }
            if (e.key === 'Escape' && isSearchOpen) {
                setIsSearchOpen(false);
                setSearchTerm('');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSearchOpen]);

    // Perform search
    useEffect(() => {
        const performSearch = async () => {
            if (searchTerm.length < 2) {
                setSearchResults([]);
                return;
            }

            setLoading(true);
            try {
                const [products, warehouses, users, bins] = await Promise.all([
                    productService.getAllProducts(),
                    warehouseService.getAllWarehouses(),
                    userService.getAllUsers(),
                    binService.getAllBins()
                ]);

                const results = [];
                const term = searchTerm.toLowerCase();

                // Search products
                products.filter(p => p.productName?.toLowerCase().includes(term) || p.sku?.toLowerCase().includes(term))
                    .slice(0, 3).forEach(p => {
                        results.push({ type: 'Product', name: p.productName, subtitle: p.sku, link: `/products` });
                    });

                // Search warehouses
                warehouses.filter(w => w.name?.toLowerCase().includes(term))
                    .slice(0, 3).forEach(w => {
                        results.push({ type: 'Warehouse', name: w.name, subtitle: w.address, link: `/warehouses` });
                    });

                // Search users
                users.filter(u => u.fullName?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term))
                    .slice(0, 3).forEach(u => {
                        results.push({ type: 'User', name: u.fullName, subtitle: u.email, link: `/users` });
                    });

                // Search bins
                bins.filter(b => b.binCode?.toLowerCase().includes(term))
                    .slice(0, 3).forEach(b => {
                        results.push({ type: 'Bin', name: b.binCode, subtitle: b.zone?.zoneName, link: `/bins` });
                    });

                setSearchResults(results);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(performSearch, 300);
        return () => clearTimeout(debounce);
    }, [searchTerm]);

    const handleResultClick = (link) => {
        navigate(link);
        setIsSearchOpen(false);
        setSearchTerm('');
        setSearchResults([]);
    };

    return (
        <>
            <header className="app-header">
                <nav className="navbar navbar-expand-lg navbar-light">
                    <ul className="navbar-nav">
                        <li className="nav-item d-block d-xl-none">
                            <a className="nav-link sidebartoggler " id="headerCollapse" href="#" onClick={(e) => { e.preventDefault(); onSidebarToggle(); }}>
                                <i className="ti ti-menu-2"></i>
                            </a>
                        </li>
                    </ul>

                    {/* Global Search - Centered */}
                    <div className="navbar-collapse justify-content-center px-0 d-none d-md-block position-relative">
                        <div className="d-flex align-items-center" role="search">
                            <div className="input-group" style={{ width: '400px' }}>
                                <span className="input-group-text border-0 bg-transparent text-muted" id="basic-addon1">
                                    <i className="ti ti-search fs-6"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-0 bg-transparent"
                                    placeholder="Search... (Ctrl+K)"
                                    aria-label="Search"
                                    aria-describedby="basic-addon1"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onFocus={() => setIsSearchOpen(true)}
                                />
                            </div>
                        </div>

                        {/* Search Results Dropdown */}
                        {isSearchOpen && searchTerm.length >= 2 && (
                            <div
                                className="position-absolute bg-white shadow-lg rounded"
                                style={{
                                    top: '100%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '400px',
                                    maxHeight: '400px',
                                    overflowY: 'auto',
                                    zIndex: 1050,
                                    marginTop: '8px'
                                }}
                            >
                                {loading ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <div className="list-group list-group-flush">
                                        {searchResults.map((result, index) => (
                                            <a
                                                key={index}
                                                href="#"
                                                className="list-group-item list-group-item-action"
                                                onClick={(e) => { e.preventDefault(); handleResultClick(result.link); }}
                                            >
                                                <div className="d-flex w-100 justify-content-between">
                                                    <h6 className="mb-1">{result.name}</h6>
                                                    <small className="text-muted">{result.type}</small>
                                                </div>
                                                <small className="text-muted">{result.subtitle}</small>
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-muted py-4">
                                        No results found
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="navbar-collapse justify-content-end px-0" id="navbarNav">
                        <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-end">
                            {/* Notification */}
                            <li className="nav-item dropdown">
                                <a
                                    className={`nav-link ${isNotificationOpen ? 'show' : ''}`}
                                    href="#"
                                    onClick={toggleNotification}
                                    id="drop1"
                                    aria-expanded={isNotificationOpen}
                                >
                                    <iconify-icon icon="solar:bell-linear" className="fs-6"></iconify-icon>
                                    <div className="notification bg-primary rounded-circle"></div>
                                </a>
                                <div
                                    className={`dropdown-menu dropdown-menu-end dropdown-menu-animate-up ${isNotificationOpen ? 'show' : ''}`}
                                    aria-labelledby="drop1"
                                    data-bs-popper={isNotificationOpen ? "static" : null}
                                >
                                    <div className="message-body">
                                        <div className="d-flex align-items-center py-3 px-7 border-bottom">
                                            <h5 className="mb-0 fs-5 fw-semibold">Notifications</h5>
                                        </div>
                                        <div className="message-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                            <a href="#" className="dropdown-item py-3 border-bottom d-flex align-items-center ">
                                                <div className="round-40 rounded-circle text-white d-flex align-items-center justify-content-center bg-danger">
                                                    <iconify-icon icon="solar:danger-triangle-line-duotone" className="fs-6"></iconify-icon>
                                                </div>
                                                <div className="w-100 ps-3">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <h6 className="mb-0 fw-semibold">Product B</h6>
                                                        <span className="fs-2 text-muted text-truncate d-block">Out of Stock</span>
                                                    </div>
                                                    <span className="fs-2 text-muted d-block">Just now</span>
                                                </div>
                                            </a>
                                            <a href="#" className="dropdown-item py-3 border-bottom d-flex align-items-center ">
                                                <div className="round-40 rounded-circle text-white d-flex align-items-center justify-content-center bg-warning">
                                                    <iconify-icon icon="solar:box-minimalistic-line-duotone" className="fs-6"></iconify-icon>
                                                </div>
                                                <div className="w-100 ps-3">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <h6 className="mb-0 fw-semibold">Product A</h6>
                                                        <span className="fs-2 text-muted text-truncate d-block">Stock below 20</span>
                                                    </div>
                                                    <span className="fs-2 text-muted d-block">10 mins ago</span>
                                                </div>
                                            </a>
                                            <a href="#" className="dropdown-item py-3 border-bottom d-flex align-items-center ">
                                                <div className="round-40 rounded-circle text-white d-flex align-items-center justify-content-center bg-secondary">
                                                    <iconify-icon icon="solar:map-point-wave-line-duotone" className="fs-6"></iconify-icon>
                                                </div>
                                                <div className="w-100 ps-3">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <h6 className="mb-0 fw-semibold">Product C</h6>
                                                        <span className="fs-2 text-muted text-truncate d-block">No Location</span>
                                                    </div>
                                                    <span className="fs-2 text-muted d-block">1 hour ago</span>
                                                </div>
                                            </a>
                                        </div>
                                        <Link to="/alerts" className="dropdown-item text-center text-primary py-3" onClick={() => setIsNotificationOpen(false)}>
                                            Check all notifications
                                        </Link>
                                    </div>
                                </div>
                            </li>

                            {/* Profile */}
                            <li className="nav-item dropdown">
                                <a
                                    className={`nav-link ${isProfileOpen ? 'show' : ''}`}
                                    href="#"
                                    onClick={toggleProfile}
                                    id="drop2"
                                    aria-expanded={isProfileOpen}
                                >
                                    <img src="/assets/images/profile/user-1.jpg" alt="" width="35" height="35" className="rounded-circle" />
                                </a>
                                <div
                                    className={`dropdown-menu dropdown-menu-end dropdown-menu-animate-up ${isProfileOpen ? 'show' : ''}`}
                                    aria-labelledby="drop2"
                                    data-bs-popper={isProfileOpen ? "static" : null}
                                >
                                    <div className="message-body">
                                        <Link to="/profile" className="d-flex align-items-center gap-2 dropdown-item" onClick={() => setIsProfileOpen(false)}>
                                            <i className="ti ti-user fs-6"></i>
                                            <p className="mb-0 fs-3">My Profile</p>
                                        </Link>
                                        <Link to="/auth/login" className="btn btn-outline-primary mx-3 mt-2 d-block" onClick={() => setIsProfileOpen(false)}>Logout</Link>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>

        </>
    );
};

export default Header;

