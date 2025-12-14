import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ onSidebarClose }) => {
    const location = useLocation();
    const [isStockOpen, setIsStockOpen] = useState(false);

    useEffect(() => {
        if (['/stock', '/import', '/export', '/product-locations', '/stock-movements'].some(path => location.pathname.startsWith(path))) {
            setIsStockOpen(true);
        } else {
            setIsStockOpen(false);
        }
    }, [location.pathname]);

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');
    const isStockActive = ['/stock', '/import', '/export', '/product-locations', '/stock-movements'].some(path => location.pathname.startsWith(path));

    return (
        <aside className="left-sidebar">
            <div>
                <div className="brand-logo d-flex align-items-center justify-content-between">
                    <Link to="/" className="text-nowrap logo-img">
                        <img src="/assets/images/logo.png" style={{ width: '150px' }} alt="" />
                    </Link>
                    <div className="close-btn d-xl-none d-block sidebartoggler cursor-pointer" id="sidebarCollapse" onClick={onSidebarClose}>
                        <i className="ti ti-x fs-8"></i>
                    </div>
                </div>
                <nav className="sidebar-nav scroll-sidebar" data-simplebar="">
                    <ul id="sidebarnav">
                        <li className="nav-small-cap">
                            <span className="hide-menu">Home</span>
                        </li>
                        <li className="sidebar-item">
                            <Link className={`sidebar-link ${isActive('/') && location.pathname === '/' ? 'active' : ''}`} to="/" aria-expanded="false">
                                <iconify-icon icon="solar:atom-line-duotone"></iconify-icon>
                                <span className="hide-menu">Dashboard</span>
                            </Link>
                        </li>

                        <li>
                            <span className="sidebar-divider lg"></span>
                        </li>
                        <li className="nav-small-cap">
                            <span className="hide-menu">UI</span>
                        </li>
                        <li className="sidebar-item">
                            <Link className={`sidebar-link ${isActive('/zone') ? 'active' : ''}`} to="/zone" aria-expanded="false">
                                <iconify-icon icon="solar:file-text-line-duotone"></iconify-icon>
                                <span className="hide-menu">Zone</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className={`sidebar-link ${isActive('/products') ? 'active' : ''}`} to="/products" aria-expanded="false">
                                <iconify-icon icon="solar:danger-circle-line-duotone"></iconify-icon>
                                <span className="hide-menu">Products</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className={`sidebar-link ${isActive('/users') ? 'active' : ''}`} to="/users" aria-expanded="false">
                                <iconify-icon icon="solar:layers-minimalistic-bold-duotone"></iconify-icon>
                                <span className="hide-menu">Users</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className={`sidebar-link ${isActive('/categories') ? 'active' : ''}`} to="/categories" aria-expanded="false">
                                <iconify-icon icon="solar:danger-circle-line-duotone"></iconify-icon>
                                <span className="hide-menu">Categories</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className={`sidebar-link ${isActive('/warehouse') ? 'active' : ''}`} to="/warehouse" aria-expanded="false">
                                <iconify-icon icon="solar:bookmark-square-minimalistic-line-duotone"></iconify-icon>
                                <span className="hide-menu">Warehouse</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className={`sidebar-link ${isActive('/bins') ? 'active' : ''}`} to="/bins" aria-expanded="false">
                                <iconify-icon icon="solar:box-minimalistic-line-duotone"></iconify-icon>
                                <span className="hide-menu">Bins</span>
                            </Link>
                        </li>

                        <li>
                            <span className="sidebar-divider lg"></span>
                        </li>

                        <li className="nav-small-cap">
                            <span className="hide-menu">Inventory</span>
                        </li>

                        <li className="sidebar-item">
                            <a
                                className={`sidebar-link justify-content-between has-arrow ${isStockActive ? 'active' : ''}`}
                                href="#"
                                onClick={(e) => { e.preventDefault(); setIsStockOpen(!isStockOpen); }}
                                aria-expanded={isStockOpen}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <span className="d-flex">
                                        <iconify-icon icon="solar:cart-3-line-duotone"></iconify-icon>
                                    </span>
                                    <span className="hide-menu">Stock</span>
                                </div>
                            </a>
                            <ul aria-expanded={isStockOpen} className={`collapse first-level ${isStockOpen ? 'show' : ''}`}>
                                <li className="sidebar-item">
                                    <Link className={`sidebar-link justify-content-between ${isActive('/stock') ? 'active' : ''}`} to="/stock">
                                        <span className="hide-menu">Stock Status</span>
                                    </Link>
                                </li>
                                <li className="sidebar-item">
                                    <Link className={`sidebar-link justify-content-between ${isActive('/product-locations') ? 'active' : ''}`} to="/product-locations">
                                        <span className="hide-menu">Product Locations</span>
                                    </Link>
                                </li>
                                <li className="sidebar-item">
                                    <Link className={`sidebar-link justify-content-between ${isActive('/stock-movements') ? 'active' : ''}`} to="/stock-movements">
                                        <span className="hide-menu">Stock Movements</span>
                                    </Link>
                                </li>
                                <li className="sidebar-item">
                                    <Link className={`sidebar-link justify-content-between ${isActive('/import') ? 'active' : ''}`} to="/import">
                                        <span className="hide-menu">Import</span>
                                    </Link>
                                </li>
                                <li className="sidebar-item">
                                    <Link className={`sidebar-link justify-content-between ${isActive('/export') ? 'active' : ''}`} to="/export">
                                        <span className="hide-menu">Export</span>
                                    </Link>
                                </li>
                                <li className="sidebar-item">
                                    <Link className={`sidebar-link justify-content-between ${isActive('/transfer-in') ? 'active' : ''}`} to="/transfer-in">
                                        <span className="hide-menu">Transfer In</span>
                                    </Link>
                                </li>
                                <li className="sidebar-item">
                                    <Link className={`sidebar-link justify-content-between ${isActive('/transfer-out') ? 'active' : ''}`} to="/transfer-out">
                                        <span className="hide-menu">Transfer Out</span>
                                    </Link>
                                </li>
                                <li className="sidebar-item">
                                    <Link className={`sidebar-link justify-content-between ${isActive('/adjust') ? 'active' : ''}`} to="/adjust">
                                        <span className="hide-menu">Adjust</span>
                                    </Link>
                                </li>
                            </ul>
                        </li>

                        <li className="sidebar-item">
                            <Link className={`sidebar-link ${isActive('/reports') ? 'active' : ''}`} to="/reports" aria-expanded="false">
                                <iconify-icon icon="solar:file-text-line-duotone"></iconify-icon>
                                <span className="hide-menu">Reports</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className={`sidebar-link ${isActive('/alerts') ? 'active' : ''}`} to="/alerts" aria-expanded="false">
                                <iconify-icon icon="solar:bell-bing-line-duotone"></iconify-icon>
                                <span className="hide-menu">Alerts</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className={`sidebar-link ${isActive('/audit-logs') ? 'active' : ''}`} to="/audit-logs" aria-expanded="false">
                                <iconify-icon icon="solar:history-line-duotone"></iconify-icon>
                                <span className="hide-menu">Audit Logs</span>
                            </Link>
                        </li>

                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
