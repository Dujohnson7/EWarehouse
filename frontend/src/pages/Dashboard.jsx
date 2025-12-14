import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import productService from '../services/productService';
import stockMovementService from '../services/stockMovementService';
import alertService from '../services/alertService';
import stockStatusService from '../services/stockStatusService';

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

                const totalProducts = products.length;
                const totalStockValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.quantity || 0)), 0);

                const imports = movements.filter(m => m.movementType === 'IN');
                const exports = movements.filter(m => m.movementType === 'OUT');

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

                setStats({
                    totalProducts,
                    totalStockValue,
                    totalImports: imports.length,
                    totalExports: exports.length,
                    products: stockStatus.slice(0, 5),  
                    alerts: alerts.filter(a => !a.isAcknowledged).slice(0, 5),
                    movements: movements.slice(0, 5)
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
                            <h4 className="fs-4 mb-1 card-title">Stock Overview</h4>
                            <p className="mb-0 card-subtitle">Recent Stock Status</p>
                        </div>
                        <div className="table-responsive products-table" data-simplebar="">
                            <table className="table text-nowrap mb-0 align-middle table-hover">
                                <thead className="fs-4">
                                    <tr>
                                        <th className="fs-3 px-4">Product</th>
                                        <th className="fs-3">Quantity</th>
                                        <th className="fs-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.products.map((p, i) => (
                                        <tr key={i}>
                                            <td>
                                                <div className="d-flex align-items-center product">
                                                    <div className="bg-primary-subtle rounded p-2 me-2">
                                                        <iconify-icon icon="solar:box-line-duotone" className="fs-4 text-primary"></iconify-icon>
                                                    </div>
                                                    <div className="ms-3 product-title">
                                                        <h6 className="fs-3 mb-0 text-truncate-2">{p.productName}</h6>
                                                        <span className="text-muted fs-2">{p.categoryName}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><h5 className="mb-0 fs-4">{p.totalQuantity}</h5></td>
                                            <td>
                                                <span className={`badge rounded-pill fs-2 fw-medium bg-${p.status === 'In Stock' ? 'success' :
                                                    p.status === 'Low Stock' ? 'warning' : 'danger'
                                                    }-subtle text-${p.status === 'In Stock' ? 'success' :
                                                        p.status === 'Low Stock' ? 'warning' : 'danger'
                                                    }`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {stats.products.length === 0 && <tr><td colSpan="3" className="text-center">No stock data</td></tr>}
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
                                        <div className="rounded-circle-shape bg-danger-subtle me-3 rounded-pill d-inline-flex align-items-center justify-content-center">
                                            <iconify-icon icon="solar:export-line-duotone" className="fs-7 text-danger"></iconify-icon>
                                        </div>
                                        <div><h6 className="mb-1 fs-3">Total Exports</h6></div>
                                    </div>
                                    <span className="badge rounded-pill fw-medium fs-2 bg-danger-subtle text-danger">{stats.totalExports}</span>
                                </li>
                                <li className="d-flex align-items-center justify-content-between py-3 border-bottom">
                                    <div className="d-flex align-items-center">
                                        <div className="rounded-circle-shape bg-warning-subtle me-3 rounded-pill d-inline-flex align-items-center justify-content-center">
                                            <iconify-icon icon="solar:bell-bing-line-duotone" className="fs-7 text-warning"></iconify-icon>
                                        </div>
                                        <div><h6 className="mb-1 fs-3">Pending Alerts</h6></div>
                                    </div>
                                    <span className="badge rounded-pill fw-medium fs-2 bg-warning-subtle text-warning">{stats.alerts.length}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
