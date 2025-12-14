import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import productService from '../services/productService';
import stockMovementService from '../services/stockMovementService';
import alertService from '../services/alertService';
import stockStatusService from '../services/stockStatusService';
import authService from '../services/authService';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalStockValue: 0,
        totalImports: 0,
        totalExports: 0,
        products: [],
        alerts: [],
        movements: []
    });

    const [movementSeries, setMovementSeries] = useState([]);
    const [movementCategories, setMovementCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [products, movements, alerts, stockStatus] = await Promise.all([
                    productService.getAllProducts(),
                    stockMovementService.getAllMovements(),
                    alertService.getAllAlerts(),
                    stockStatusService.getAllStockStatuses()
                ]);

                // Permission Check
                const isAdmin = authService.isAdmin();
                const isGeneralManager = authService.getUserRole() === 'General_Manager';
                const userWarehouseId = authService.getUserWarehouse();

                let filteredMovements = movements;
                let filteredStockStatus = stockStatus;
                let filteredAlerts = alerts;

                if (!isAdmin && !isGeneralManager && userWarehouseId) {
                    const whId = parseInt(userWarehouseId);
                    filteredMovements = movements.filter(m => m.warehouseID === whId);
                    filteredStockStatus = stockStatus.filter(s => s.warehouseID === whId);
                    // Alerts DTO has WarehouseID nullable
                    filteredAlerts = alerts.filter(a => a.warehouseID === whId);
                }

                const totalProducts = products.length; // Products are global catalogue, count remains same? Or filter by stock? 
                // Usually dashboard shows Total Products in Catalogue. Let's keep it global or filter if needed.
                // Request said "on dashboard display according warehouseid". 
                // Let's assume Total Products means "Products I have stock of" or "Products available to me".
                // But Product definition is global. Let's stick to global count for products, but stock value based on local stock.

                const totalStockValue = filteredStockStatus.reduce((sum, s) => {
                    // We need price from product. StockStatus includes Product object.
                    return sum + ((s.product?.price || 0) * (s.quantity || 0));
                }, 0);

                const imports = filteredMovements.filter(m => m.movementType === 'IN');
                const exports = filteredMovements.filter(m => m.movementType === 'OUT');

                const days = [];
                const importData = [];
                const exportData = [];

                for (let i = 6; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    const dayName = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                    days.push(dayName);

                    const dayImports = imports.filter(m => {
                        const movDate = new Date(m.createdAt || m.movementDate);
                        return movDate.toDateString() === d.toDateString();
                    }).length;

                    const dayExports = exports.filter(m => {
                        const movDate = new Date(m.createdAt || m.movementDate);
                        return movDate.toDateString() === d.toDateString();
                    }).length;

                    importData.push(dayImports);
                    exportData.push(dayExports);
                }

                setMovementCategories(days);
                setMovementSeries([
                    { name: "Imports", data: importData },
                    { name: "Exports", data: exportData }
                ]);

                // Calculate stock health
                const lowStockCount = filteredStockStatus.filter(s => (s.stockLevel === 'Low Stock') || (s.quantity < 10 && s.quantity > 0)).length;
                const outOfStockCount = filteredStockStatus.filter(s => s.quantity === 0).length;

                setStats({
                    totalProducts, // Keeping global catalogue count
                    totalStockValue,
                    totalImports: imports.length,
                    totalExports: exports.length,
                    lowStockCount,
                    outOfStockCount,
                    products: filteredStockStatus.slice(0, 5),
                    alerts: filteredAlerts.filter(a => !a.isAcknowledged).slice(0, 5),
                    movements: filteredMovements
                        .sort((a, b) => new Date(b.createdAt || b.movementDate) - new Date(a.createdAt || a.movementDate))
                        .slice(0, 5)
                });

            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const movementOptions = {
        chart: { type: 'area', height: 300, toolbar: { show: false } },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: { categories: movementCategories },
        colors: ["#13deb9", "#fa896b"],
        fill: { type: 'gradient', gradient: { shadeIntensity: 0, opacityFrom: 0.5, opacityTo: 0 } },
        grid: { strokeDashArray: 3, borderColor: "#90A4AE50" },
        tooltip: { theme: "dark" }
    };

    if (loading) return <div>Loading Dashboard...</div>;

    return (
        <div className="row">
            <div className="col-lg-8 d-flex align-items-strech">
                <div className="card w-100">
                    <div className="card-body">
                        <div className="d-sm-flex d-block align-items-center justify-content-between mb-9">
                            <div className="mb-3 mb-sm-0">
                                <h5 className="card-title fw-semibold">Stock Movements</h5>
                            </div>
                        </div>
                        <Chart options={movementOptions} series={movementSeries} type="area" height={300} />
                    </div>
                </div>
            </div>

            <div className="col-lg-4">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card bg-primary-subtle shadow-none w-100">
                            <div className="card-body">
                                <div className="d-flex mb-10 pb-1 justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-6">
                                        <div className="rounded-circle-shape bg-primary px-3 py-2 rounded-pill d-inline-flex align-items-center justify-content-center">
                                            <iconify-icon icon="solar:box-bold-duotone" className="fs-7 text-white"></iconify-icon>
                                        </div>
                                        <h6 className="mb-0 fs-4 fw-medium text-muted">Total Products</h6>
                                    </div>
                                </div>
                                <div className="row align-items-end justify-content-between">
                                    <div className="col-12">
                                        <h2 className="mb-6 fs-8">{stats.totalProducts}</h2>
                                        <span className="badge rounded-pill border border-muted fw-bold text-muted fs-2 py-1">Items in catalog</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-12">
                        <div className="card bg-secondary-subtle shadow-none w-100">
                            <div className="card-body">
                                <div className="d-flex mb-10 pb-1 justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-6">
                                        <div className="rounded-circle-shape bg-secondary px-3 py-2 rounded-pill d-inline-flex align-items-center justify-content-center">
                                            <iconify-icon icon="solar:wallet-2-line-duotone" className="fs-7 text-white"></iconify-icon>
                                        </div>
                                        <h6 className="mb-0 fs-4 fw-medium text-muted">Est. Stock Value</h6>
                                    </div>
                                </div>
                                <div className="row align-items-center justify-content-between pt-4">
                                    <div className="col-12">
                                        <h2 className="mb-6 fs-8 text-nowrap">RF{stats.totalStockValue.toLocaleString()}</h2>
                                        <span className="badge rounded-pill border border-muted fw-bold text-muted fs-2 py-1">Based on current stock</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-8 d-flex align-items-stretch">
                    <div className="card w-100 overflow-hidden">
                        <div className="card-body pb-0">
                            <h4 className="fs-4 mb-1 card-title">Recent Stock Movements</h4>
                            <p className="mb-0 card-subtitle">Last 5 transactions</p>
                        </div>
                        <div className="table-responsive products-table" data-simplebar="">
                            <table className="table text-nowrap mb-0 align-middle table-hover">
                                <thead className="fs-4">
                                    <tr>
                                        <th className="fs-3 px-4">Type</th>
                                        <th className="fs-3">Product</th>
                                        <th className="fs-3">Quantity</th>
                                        <th className="fs-3">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.movements.length > 0 ? stats.movements.map((m, i) => (
                                        <tr key={i}>
                                            <td>
                                                <span className={`badge rounded-pill fs-2 fw-medium ${m.movementType === 'IN' ? 'bg-success-subtle text-success' :
                                                    m.movementType === 'OUT' ? 'bg-danger-subtle text-danger' :
                                                        m.movementType === 'ADJUST' ? 'bg-info-subtle text-info' :
                                                            'bg-warning-subtle text-warning'
                                                    }`}>
                                                    {m.movementType}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center product">
                                                    <div className={`rounded p-2 me-2 ${m.movementType === 'IN' ? 'bg-success-subtle' :
                                                        m.movementType === 'OUT' ? 'bg-danger-subtle' :
                                                            m.movementType === 'ADJUST' ? 'bg-info-subtle' :
                                                                'bg-warning-subtle'
                                                        }`}>
                                                        <iconify-icon icon={
                                                            m.movementType === 'IN' ? 'solar:import-bold-duotone' :
                                                                m.movementType === 'OUT' ? 'solar:export-bold-duotone' :
                                                                    m.movementType === 'ADJUST' ? 'solar:settings-bold-duotone' :
                                                                        'solar:transfer-horizontal-bold-duotone'
                                                        } className={`fs-4 ${m.movementType === 'IN' ? 'text-success' :
                                                            m.movementType === 'OUT' ? 'text-danger' :
                                                                m.movementType === 'ADJUST' ? 'text-info' :
                                                                    'text-warning'
                                                            }`}></iconify-icon>
                                                    </div>
                                                    <div className="ms-2 product-title">
                                                        <h6 className="fs-3 mb-0">{m.product?.productName || 'Unknown'}</h6>
                                                        <span className="text-muted fs-2">{m.warehouse?.name || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <h5 className={`mb-0 fs-4 ${m.movementType === 'OUT' ? 'text-danger' : 'text-success'}`}>
                                                    {m.movementType === 'OUT' ? '-' : '+'}{m.quantity}
                                                </h5>
                                            </td>
                                            <td>
                                                <span className="text-muted fs-2">
                                                    {new Date(m.createdAt || m.movementDate).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="4" className="text-center">No recent movements</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4 d-flex align-items-stretch">
                    <div className="card w-100">
                        <div className="card-body">
                            <h4 className="mb-0 card-title">Warehouse Statistics</h4>
                            <ul className="list-unstyled mb-0 mt-3">
                                <li className="d-flex align-items-center justify-content-between py-3 border-bottom">
                                    <div className="d-flex align-items-center">
                                        <div className="rounded-circle-shape bg-success-subtle me-3 rounded-pill d-inline-flex align-items-center justify-content-center">
                                            <iconify-icon icon="solar:import-line-duotone" className="fs-7 text-success"></iconify-icon>
                                        </div>
                                        <div><h6 className="mb-1 fs-3">Total Imports</h6></div>
                                    </div>
                                    <span className="badge rounded-pill fw-medium fs-2 bg-success-subtle text-success">{stats.totalImports}</span>
                                </li>
                                <li className="d-flex align-items-center justify-content-between py-3 border-bottom">
                                    <div className="d-flex align-items-center">
                                        <div className="rounded-circle-shape bg-warning-subtle me-3 rounded-pill d-inline-flex align-items-center justify-content-center">
                                            <iconify-icon icon="solar:danger-triangle-line-duotone" className="fs-7 text-warning"></iconify-icon>
                                        </div>
                                        <div><h6 className="mb-1 fs-3">Low Stock Items</h6></div>
                                    </div>
                                    <span className="badge rounded-pill fw-medium fs-2 bg-warning-subtle text-warning">{stats.lowStockCount || 0}</span>
                                </li>
                                <li className="d-flex align-items-center justify-content-between py-3 border-bottom">
                                    <div className="d-flex align-items-center">
                                        <div className="rounded-circle-shape bg-danger-subtle me-3 rounded-pill d-inline-flex align-items-center justify-content-center">
                                            <iconify-icon icon="solar:forbidden-circle-line-duotone" className="fs-7 text-danger"></iconify-icon>
                                        </div>
                                        <div><h6 className="mb-1 fs-3">Out of Stock</h6></div>
                                    </div>
                                    <span className="badge rounded-pill fw-medium fs-2 bg-danger-subtle text-danger">{stats.outOfStockCount || 0}</span>
                                </li>
                               {/* <li className="d-flex align-items-center justify-content-between py-3 border-bottom">
                                    <div className="d-flex align-items-center">
                                        <div className="rounded-circle-shape bg-warning-subtle me-3 rounded-pill d-inline-flex align-items-center justify-content-center">
                                            <iconify-icon icon="solar:bell-bing-line-duotone" className="fs-7 text-warning"></iconify-icon>
                                        </div>
                                        <div><h6 className="mb-1 fs-3">Pending Alerts</h6></div>
                                    </div>
                                    <span className="badge rounded-pill fw-medium fs-2 bg-warning-subtle text-warning">{stats.alerts.length}</span>
                                </li> */}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
