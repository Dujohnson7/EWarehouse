import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import { canAccessPage } from '../config/roleConfig';

const Sidebar = ({ onSidebarClose }) => {
    const location = useLocation();
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);
    const userRole = authService.getUserRole();

    // Check permissions for main sections
    const p = {
        dashboard: canAccessPage(userRole, '/dashboard'),
        zone: canAccessPage(userRole, '/zones'),
        products: canAccessPage(userRole, '/products'),
        users: canAccessPage(userRole, '/users'),
        categories: canAccessPage(userRole, '/categories'),
        warehouses: canAccessPage(userRole, '/warehouses'),
        bins: canAccessPage(userRole, '/bins'),

        // Inventory submenu
        stockStatus: canAccessPage(userRole, '/stockstatus'),
        productLocation: canAccessPage(userRole, '/productlocation'),
        stockMovements: canAccessPage(userRole, '/stockmovements'),
        import: canAccessPage(userRole, '/import'),
        export: canAccessPage(userRole, '/export'),
        transferIn: canAccessPage(userRole, '/transfer-in'),
        transferOut: canAccessPage(userRole, '/transfer-out'),
        adjust: canAccessPage(userRole, '/adjustment'),

        reports: canAccessPage(userRole, '/reports'),
        alerts: true, 
        audit: canAccessPage(userRole, '/audit'),
    };
 
    const showInventory = p.stockStatus || p.productLocation || p.stockMovements || p.import || p.export || p.transferIn || p.transferOut || p.adjust;

    useEffect(() => {
        if (['/stock', '/import', '/export', '/product-locations', '/stock-movements', '/transfer-in', '/transfer-out', '/adjust', '/adjustment'].some(path => location.pathname.startsWith(path))) {
            setIsInventoryOpen(true);
        } else {
            setIsInventoryOpen(false);
        }
    }, [location.pathname]);

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');
    const isInventoryActive = ['/stock-status', '/product-location', '/stock-movements', '/import', '/export', '/transfer-in', '/transfer-out', '/adjustment'].some(path => location.pathname.startsWith(path));

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
                        {p.dashboard && (
                            <li className="sidebar-item">
                                <Link className={`sidebar-link ${isActive('/') || isActive('/dashboard') ? 'active' : ''}`} to="/dashboard" aria-expanded="false">
                                    <iconify-icon icon="solar:atom-line-duotone"></iconify-icon>
                                    <span className="hide-menu">Dashboard</span>
                                </Link>
                            </li>
                        )}

                        <li>
                            <span className="sidebar-divider lg"></span>
                        </li> 

                        {p.zone && (
                            <li className="sidebar-item">
                                <Link className={`sidebar-link ${isActive('/zone') ? 'active' : ''}`} to="/zone" aria-expanded="false">
                                    <iconify-icon icon="solar:file-text-line-duotone"></iconify-icon>
                                    <span className="hide-menu">Zone</span>
                                </Link>
                            </li>
                        )}
                        {p.products && (
                            <li className="sidebar-item">
                                <Link className={`sidebar-link ${isActive('/products') ? 'active' : ''}`} to="/products" aria-expanded="false">
                                    <iconify-icon icon="solar:danger-circle-line-duotone"></iconify-icon>
                                    <span className="hide-menu">Products</span>
                                </Link>
                            </li>
                        )}
                        {p.users && (
                            <li className="sidebar-item">
                                <Link className={`sidebar-link ${isActive('/users') ? 'active' : ''}`} to="/users" aria-expanded="false">
                                    <iconify-icon icon="solar:layers-minimalistic-bold-duotone"></iconify-icon>
                                    <span className="hide-menu">Users</span>
                                </Link>
                            </li>
                        )}
                        {p.categories && (
                            <li className="sidebar-item">
                                <Link className={`sidebar-link ${isActive('/categories') ? 'active' : ''}`} to="/categories" aria-expanded="false">
                                    <iconify-icon icon="solar:danger-circle-line-duotone"></iconify-icon>
                                    <span className="hide-menu">Categories</span>
                                </Link>
                            </li>
                        )}
                        {p.warehouses && (
                            <li className="sidebar-item">
                                <Link className={`sidebar-link ${isActive('/warehouses') ? 'active' : ''}`} to="/warehouses" aria-expanded="false">
                                    <iconify-icon icon="solar:bookmark-square-minimalistic-line-duotone"></iconify-icon>
                                    <span className="hide-menu">Warehouse</span>
                                </Link>
                            </li>
                        )}
                        {p.bins && (
                            <li className="sidebar-item">
                                <Link className={`sidebar-link ${isActive('/bins') ? 'active' : ''}`} to="/bins" aria-expanded="false">
                                    <iconify-icon icon="solar:box-minimalistic-line-duotone"></iconify-icon>
                                    <span className="hide-menu">Bins</span>
                                </Link>
                            </li>
                        )}

                        <li>
                            <span className="sidebar-divider lg"></span>
                        </li>

                        <li className="nav-small-cap">
                            <span className="hide-menu">Inventory</span>
                        </li>

                        {showInventory && (
                            <li className="sidebar-item">
                                <a
                                    className={`sidebar-link justify-content-between has-arrow ${isInventoryActive ? 'active' : ''}`}
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); setIsInventoryOpen(!isInventoryOpen); }}
                                    aria-expanded={isInventoryOpen}
                                >
                                    <div className="d-flex align-items-center gap-3">
                                        <span className="d-flex">
                                            <iconify-icon icon="solar:cart-3-line-duotone"></iconify-icon>
                                        </span>
                                        <span className="hide-menu">Stock</span>
                                    </div>
                                </a>
                                <ul aria-expanded={isInventoryOpen} className={`collapse first-level ${isInventoryOpen ? 'show' : ''}`}>
                                    {p.stockStatus && (
                                        <li className="sidebar-item">
                                            <Link className={`sidebar-link justify-content-between ${isActive('/stock-status') ? 'active' : ''}`} to="/stock-status">
                                                <span className="hide-menu">Stock Status</span>
                                            </Link>
                                        </li>
                                    )}
                                    {p.productLocation && (
                                        <li className="sidebar-item">
                                            <Link className={`sidebar-link justify-content-between ${isActive('/product-location') ? 'active' : ''}`} to="/product-location">
                                                <span className="hide-menu">Product Locations</span>
                                            </Link>
                                        </li>
                                    )}
                                    {p.stockMovements && (
                                        <li className="sidebar-item">
                                            <Link className={`sidebar-link justify-content-between ${isActive('/stock-movements') ? 'active' : ''}`} to="/stock-movements">
                                                <span className="hide-menu">Stock Movements</span>
                                            </Link>
                                        </li>
                                    )}
                                    {p.import && (
                                        <li className="sidebar-item">
                                            <Link className={`sidebar-link justify-content-between ${isActive('/import') ? 'active' : ''}`} to="/import">
                                                <span className="hide-menu">Import</span>
                                            </Link>
                                        </li>
                                    )}
                                    {p.export && (
                                        <li className="sidebar-item">
                                            <Link className={`sidebar-link justify-content-between ${isActive('/export') ? 'active' : ''}`} to="/export">
                                                <span className="hide-menu">Export</span>
                                            </Link>
                                        </li>
                                    )}
                                    {/*}
                                    {p.transferIn && (
                                        <li className="sidebar-item">
                                            <Link className={`sidebar-link justify-content-between ${isActive('/transfer-in') ? 'active' : ''}`} to="/transfer-in">
                                                <span className="hide-menu">Transfer In</span>
                                            </Link>
                                        </li>
                                    )}
                                    {p.transferOut && (
                                        <li className="sidebar-item">
                                            <Link className={`sidebar-link justify-content-between ${isActive('/transfer-out') ? 'active' : ''}`} to="/transfer-out">
                                                <span className="hide-menu">Transfer Out</span>
                                            </Link>
                                        </li>
                                    )}*/}
                                    {p.adjust && (
                                        <li className="sidebar-item">
                                            <Link className={`sidebar-link justify-content-between ${isActive('/adjustment') ? 'active' : ''}`} to="/adjustment">
                                                <span className="hide-menu">Adjust</span>
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </li>
                        )}

                        {p.reports && (
                            <li className="sidebar-item">
                                <Link className={`sidebar-link ${isActive('/reports') ? 'active' : ''}`} to="/reports" aria-expanded="false">
                                    <iconify-icon icon="solar:file-text-line-duotone"></iconify-icon>
                                    <span className="hide-menu">Reports</span>
                                </Link>
                            </li>
                        )} 
                        {p.audit && (
                            <li className="sidebar-item">
                                <Link className={`sidebar-link ${isActive('/audit-logs') ? 'active' : ''}`} to="/audit-logs" aria-expanded="false">
                                    <iconify-icon icon="solar:history-line-duotone"></iconify-icon>
                                    <span className="hide-menu">Audit Logs</span>
                                </Link>
                            </li>
                        )}

                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
