import React, { useState, useEffect } from 'react';
import stockMovementService from '../services/stockMovementService';
import productService from '../services/productService';
import warehouseService from '../services/warehouseService';
import stockStatusService from '../services/stockStatusService';
import zoneService from '../services/zoneService';
import userService from '../services/userService';

const Reports = () => {
    const [reportType, setReportType] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [warehouse, setWarehouse] = useState('All Warehouses');
    const [exportFormat, setExportFormat] = useState('pdf');
    const [reportData, setReportData] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(false);

    // Stats for summary cards
    const [stats, setStats] = useState({
        totalItems: 0,
        totalWarehouses: 0,
        totalZones: 0,
        totalUsers: 0
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [warehousesData, zonesData, usersData, productsData] = await Promise.all([
                    warehouseService.getAllWarehouses(),
                    zoneService.getAllZones(),
                    userService.getAllUsers(),
                    productService.getAllProducts()
                ]);
                setWarehouses(warehousesData);
                setStats({
                    totalItems: productsData.length,
                    totalWarehouses: warehousesData.length,
                    totalZones: zonesData.length,
                    totalUsers: usersData.length
                });
            } catch (error) {
                console.error('Failed to load initial data', error);
            }
        };
        fetchInitialData();
    }, []);

    const generateReport = async () => {
        if (!reportType || reportType === 'Select Report Type') {
            alert('Please select a report type');
            return;
        }

        setLoading(true);
        try {
            let data = [];

            switch (reportType) {
                case 'Stock Movement':
                    const movements = await stockMovementService.getAllMovements();
                    data = movements.filter(m => {
                        if (!dateFrom && !dateTo) return true;
                        const movDate = new Date(m.createdAt || m.movementDate);
                        const from = dateFrom ? new Date(dateFrom) : new Date('1900-01-01');
                        const to = dateTo ? new Date(dateTo) : new Date('2100-12-31');
                        return movDate >= from && movDate <= to;
                    });
                    break;
                case 'Product Analysis':
                    const products = await productService.getAllProducts();
                    data = products;
                    break;
                case 'Warehouse Summary':
                    const stockStatus = await stockStatusService.getAllStockStatuses();
                    data = stockStatus;
                    break;
                default:
                    data = [];
            }

            setReportData(data);
            alert(`Report generated successfully! Found ${data.length} records.`);
        } catch (error) {
            console.error('Failed to generate report', error);
            alert('Failed to generate report');
        } finally {
            setLoading(false);
        }
    };

    // Helper function to export to CSV
    const exportToCSV = (data, filename) => {
        let csvContent = 'Report Type,Date From,Date To,Warehouse\n';
        csvContent += `${data.type},${data.dateFrom || 'N/A'},${data.dateTo || 'N/A'},${data.warehouse || 'All'}\n\n`;

        // Add headers based on report type
        if (reportType === 'Stock Movement') {
            csvContent += 'Movement ID,Product,Type,Quantity,User,Date\n';
            reportData.forEach(item => {
                csvContent += `${item.movementID},${item.product?.productName || 'N/A'},${item.movementType},${item.quantity},${item.user?.fullName || 'N/A'},${new Date(item.createdAt).toLocaleDateString()}\n`;
            });
        } else if (reportType === 'Product Analysis') {
            csvContent += 'Product ID,Product Name,SKU,Category,Price,Status\n';
            reportData.forEach(item => {
                csvContent += `${item.productID},${item.productName},${item.sku},${item.category?.name || 'N/A'},${item.price},${item.isActive ? 'Active' : 'Inactive'}\n`;
            });
        } else if (reportType === 'Warehouse Summary') {
            csvContent += 'Product,Warehouse,Quantity,Stock Level,Last Updated\n';
            reportData.forEach(item => {
                csvContent += `${item.product?.productName || 'N/A'},${item.warehouse?.name || 'N/A'},${item.quantity},${item.stockLevel || 'Unknown'},${item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString() : 'N/A'}\n`;
            });
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename + '.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Helper function to export to Excel
    const exportToExcel = (data, filename) => {
        // Same as CSV for simplicity
        exportToCSV(data, filename.replace('.xlsx', ''));
    };

    // Helper function to export to PDF
    const exportToPDF = (data, filename) => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>' + filename + '</title>');
        printWindow.document.write('<style>body{font-family:Arial;padding:20px;}table{border-collapse:collapse;width:100%;margin-top:20px;}th,td{border:1px solid #ddd;padding:8px;text-align:left;}th{background-color:#f2f2f2;}</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write('<h2>Warehouse Report</h2>');
        printWindow.document.write('<p><strong>Report Type:</strong> ' + data.type + '</p>');
        printWindow.document.write('<p><strong>Date From:</strong> ' + (data.dateFrom || 'N/A') + '</p>');
        printWindow.document.write('<p><strong>Date To:</strong> ' + (data.dateTo || 'N/A') + '</p>');
        printWindow.document.write('<p><strong>Warehouse:</strong> ' + (data.warehouse || 'All') + '</p>');
        printWindow.document.write('<p><strong>Total Records:</strong> ' + reportData.length + '</p>');
        printWindow.document.write('<table>');

        // Add headers based on report type
        if (reportType === 'Stock Movement') {
            printWindow.document.write('<tr><th>Movement ID</th><th>Product</th><th>Type</th><th>Quantity</th><th>User</th><th>Date</th></tr>');
            reportData.forEach(item => {
                printWindow.document.write(`<tr><td>${item.movementID}</td><td>${item.product?.productName || 'N/A'}</td><td>${item.movementType}</td><td>${item.quantity}</td><td>${item.user?.fullName || 'N/A'}</td><td>${new Date(item.createdAt).toLocaleDateString()}</td></tr>`);
            });
        } else if (reportType === 'Product Analysis') {
            printWindow.document.write('<tr><th>Product ID</th><th>Product Name</th><th>SKU</th><th>Category</th><th>Price</th><th>Status</th></tr>');
            reportData.forEach(item => {
                printWindow.document.write(`<tr><td>${item.productID}</td><td>${item.productName}</td><td>${item.sku}</td><td>${item.category?.name || 'N/A'}</td><td>$${item.price?.toFixed(2)}</td><td>${item.isActive ? 'Active' : 'Inactive'}</td></tr>`);
            });
        } else if (reportType === 'Warehouse Summary') {
            printWindow.document.write('<tr><th>Product</th><th>Warehouse</th><th>Quantity</th><th>Stock Level</th><th>Last Updated</th></tr>');
            reportData.forEach(item => {
                printWindow.document.write(`<tr><td>${item.product?.productName || 'N/A'}</td><td>${item.warehouse?.name || 'N/A'}</td><td>${item.quantity}</td><td>${item.stockLevel || 'Unknown'}</td><td>${item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString() : 'N/A'}</td></tr>`);
            });
        }

        printWindow.document.write('</table>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    const handleExport = () => {
        const reportType = document.getElementById('reportType').value;
        const dateFrom = document.getElementById('reportDateFrom').value;
        const dateTo = document.getElementById('reportDateTo').value;
        const warehouse = document.getElementById('reportWarehouse').value;
        const format = document.getElementById('exportFormat').value;

        if (!reportType || reportType === 'Select Report Type') {
            alert('Please select a report type');
            return;
        }

        const filename = 'warehouse_report_' + new Date().toISOString().split('T')[0];

        const reportData = {
            type: reportType,
            dateFrom: dateFrom,
            dateTo: dateTo,
            warehouse: warehouse,
            format: format
        };

        if (format === 'csv') {
            exportToCSV(reportData, filename);
        } else if (format === 'xlsx') {
            exportToExcel(reportData, filename);
        } else {
            exportToPDF(reportData, filename);
        }
    };

    const handleGenerate = (e) => {
        e.preventDefault();
        generateReport();
    };

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Reports</h5>

                <div className="row">
                    <div className="col-md-6 col-lg-3">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <div className="bg-primary-subtle rounded p-3">
                                            <iconify-icon icon="solar:box-line-duotone" class="fs-3 text-primary"></iconify-icon>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <h6 className="mb-0">Total Items</h6>
                                        <h4 className="mb-0 mt-2">{stats.totalItems}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <div className="bg-success-subtle rounded p-3">
                                            <iconify-icon icon="solar:warehouse-line-duotone" class="fs-3 text-success"></iconify-icon>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <h6 className="mb-0">Warehouses</h6>
                                        <h4 className="mb-0 mt-2">{stats.totalWarehouses}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <div className="bg-info-subtle rounded p-3">
                                            <iconify-icon icon="solar:folder-line-duotone" class="fs-3 text-info"></iconify-icon>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <h6 className="mb-0">Zones</h6>
                                        <h4 className="mb-0 mt-2">{stats.totalZones}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <div className="bg-warning-subtle rounded p-3">
                                            <iconify-icon icon="solar:user-line-duotone" class="fs-3 text-warning"></iconify-icon>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <h6 className="mb-0">Users</h6>
                                        <h4 className="mb-0 mt-2">{stats.totalUsers}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title fw-semibold mb-4">Generate Report</h5>
                                <form onSubmit={handleGenerate}>
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="reportType" className="form-label">Report Type</label>
                                            <select className="form-select" id="reportType" value={reportType} onChange={(e) => setReportType(e.target.value)}>
                                                <option>Select Report Type</option>
                                                <option>Stock Movement</option>
                                                <option>Product Analysis</option>
                                                <option>Warehouse Summary</option>
                                                <option>User Activity</option>
                                            </select>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="reportDateFrom" className="form-label">Date From</label>
                                            <input type="date" className="form-control" id="reportDateFrom" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="reportDateTo" className="form-label">Date To</label>
                                            <input type="date" className="form-control" id="reportDateTo" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="reportWarehouse" className="form-label">Warehouse (Optional)</label>
                                        <select className="form-select" id="reportWarehouse" value={warehouse} onChange={(e) => setWarehouse(e.target.value)}>
                                            <option>All Warehouses</option>
                                            {warehouses.map(wh => (
                                                <option key={wh.warehouseID} value={wh.name}>{wh.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exportFormat" className="form-label">Export Format</label>
                                        <select className="form-select" id="exportFormat" value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
                                            <option value="pdf">PDF</option>
                                            <option value="csv">CSV</option>
                                            <option value="xlsx">Excel (.xlsx)</option>
                                        </select>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button type="submit" className="btn btn-primary" disabled={loading}>
                                            {loading ? 'Generating...' : 'Generate Report'}
                                        </button>
                                        <button type="button" className="btn btn-success" onClick={handleExport} disabled={reportData.length === 0}>
                                            Export Report
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Report Data Table */}
                {reportData.length > 0 && (
                    <div className="row mt-4">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title fw-semibold mb-4">Report Results ({reportData.length} records)</h5>
                                    <div className="table-responsive">
                                        <table className="table table-striped align-middle text-nowrap">
                                            <thead>
                                                <tr>
                                                    {reportType === 'Stock Movement' && (
                                                        <>
                                                            <th>Movement ID</th>
                                                            <th>Product</th>
                                                            <th>Type</th>
                                                            <th>Quantity</th>
                                                            <th>User</th>
                                                            <th>Date</th>
                                                        </>
                                                    )}
                                                    {reportType === 'Product Analysis' && (
                                                        <>
                                                            <th>Product ID</th>
                                                            <th>Product Name</th>
                                                            <th>SKU</th>
                                                            <th>Category</th>
                                                            <th>Price</th>
                                                            <th>Status</th>
                                                        </>
                                                    )}
                                                    {reportType === 'Warehouse Summary' && (
                                                        <>
                                                            <th>Product</th>
                                                            <th>Warehouse</th>
                                                            <th>Quantity</th>
                                                            <th>Stock Level</th>
                                                            <th>Last Updated</th>
                                                        </>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reportType === 'Stock Movement' && reportData.map((item) => (
                                                    <tr key={item.movementID}>
                                                        <td>{item.movementID}</td>
                                                        <td>{item.product?.productName || 'N/A'}</td>
                                                        <td>
                                                            <span className={`badge ${item.movementType === 'IN' ? 'bg-success' :
                                                                item.movementType === 'OUT' ? 'bg-danger' :
                                                                    'bg-warning'
                                                                }`}>
                                                                {item.movementType}
                                                            </span>
                                                        </td>
                                                        <td>{item.quantity}</td>
                                                        <td>{item.user?.fullName || 'N/A'}</td>
                                                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                                    </tr>
                                                ))}
                                                {reportType === 'Product Analysis' && reportData.map((item) => (
                                                    <tr key={item.productID}>
                                                        <td>{item.productID}</td>
                                                        <td>{item.productName}</td>
                                                        <td>{item.sku}</td>
                                                        <td>{item.category?.name || 'N/A'}</td>
                                                        <td>${item.price?.toFixed(2)}</td>
                                                        <td>
                                                            <span className={`badge ${item.isActive ? 'bg-success' : 'bg-danger'}`}>
                                                                {item.isActive ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {reportType === 'Warehouse Summary' && reportData.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.product?.productName || 'N/A'}</td>
                                                        <td>{item.warehouse?.name || 'N/A'}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>
                                                            <span className={`badge ${item.stockLevel === 'In Stock' ? 'bg-success' :
                                                                item.stockLevel === 'Low Stock' ? 'bg-warning' :
                                                                    'bg-danger'
                                                                }`}>
                                                                {item.stockLevel || 'Unknown'}
                                                            </span>
                                                        </td>
                                                        <td>{item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString() : 'N/A'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;
