import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import PlaceholderPage from './pages/PlaceholderPage';
import Zone from './pages/Zone';
import Products from './pages/Products';
import Users from './pages/Users';
import Categories from './pages/Categories';
import Warehouse from './pages/Warehouse';
import AddWarehouse from './pages/AddWarehouse';
import EditWarehouse from './pages/EditWarehouse';
import Bins from './pages/Bins';
import AddBin from './pages/AddBin';
import EditBin from './pages/EditBin';
import ProductLocations from './pages/ProductLocations';
import AddProductLocation from './pages/AddProductLocation';
import EditProductLocation from './pages/EditProductLocation';
import StockMovements from './pages/StockMovements';
import Alerts from './pages/Alerts';
import AuditLogs from './pages/AuditLogs';
import Stock from './pages/Stock';
import Import from './pages/Import';
import Export from './pages/Export';
import Reports from './pages/Reports';
import AddZone from './pages/AddZone';
import EditZone from './pages/EditZone';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import AddUser from './pages/AddUser';
import EditUser from './pages/EditUser';
import AddCategory from './pages/AddCategory';
import EditCategory from './pages/EditCategory';
import AddImport from './pages/AddImport';
import EditImport from './pages/EditImport';
import AddExport from './pages/AddExport';
import EditExport from './pages/EditExport';
import Profile from './pages/Profile';
import ForgotPassword from './pages/auth/ForgotPassword';
import TransferIn from './pages/TransferIn';
import TransferOut from './pages/TransferOut';
import Adjust from './pages/Adjust';
import AddAdjust from './pages/AddAdjust';
import EditAdjust from './pages/EditAdjust';
import AddTransferOut from './pages/AddTransferOut';
import EditTransferOut from './pages/EditTransferOut';

import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <Router>
            <Routes>
                {/* Main Application Routes */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

                    {/* Entity List Pages */}
                    <Route path="zone" element={<PrivateRoute requiredPath="/zones"><Zone /></PrivateRoute>} />
                    <Route path="products" element={<PrivateRoute requiredPath="/products"><Products /></PrivateRoute>} />
                    <Route path="users" element={<PrivateRoute requiredPath="/users"><Users /></PrivateRoute>} />
                    <Route path="categories" element={<PrivateRoute requiredPath="/categories"><Categories /></PrivateRoute>} />
                    <Route path="warehouses" element={<PrivateRoute requiredPath="/warehouses"><Warehouse /></PrivateRoute>} />
                    <Route path="bins" element={<PrivateRoute requiredPath="/bins"><Bins /></PrivateRoute>} />
                    <Route path="product-location" element={<PrivateRoute requiredPath="/productlocation"><ProductLocations /></PrivateRoute>} />
                    <Route path="stock-movements" element={<PrivateRoute requiredPath="/stockmovements"><StockMovements /></PrivateRoute>} />
                    <Route path="stock-status" element={<PrivateRoute requiredPath="/stockstatus"><Stock /></PrivateRoute>} />
                    <Route path="alerts" element={<PrivateRoute><Alerts /></PrivateRoute>} />
                    <Route path="audit-logs" element={<PrivateRoute requiredPath="/audit"><AuditLogs /></PrivateRoute>} />
                    <Route path="import" element={<PrivateRoute requiredPath="/import"><Import /></PrivateRoute>} />
                    <Route path="export" element={<PrivateRoute requiredPath="/export"><Export /></PrivateRoute>} />
                    <Route path="reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
                    <Route path="profile" element={<PrivateRoute requiredPath="/profile"><Profile /></PrivateRoute>} />
                    <Route path="transfer-in" element={<PrivateRoute requiredPath="/transfer-in"><TransferIn /></PrivateRoute>} />
                    <Route path="transfer-out" element={<PrivateRoute requiredPath="/transfer-out"><TransferOut /></PrivateRoute>} />
                    <Route path="adjustment" element={<PrivateRoute requiredPath="/adjustment"><Adjust /></PrivateRoute>} />

                    {/* Add/Edit Pages */}
                    <Route path="warehouses/add" element={<PrivateRoute requiredPath="/warehouses"><AddWarehouse /></PrivateRoute>} />
                    <Route path="warehouses/edit/:id" element={<PrivateRoute requiredPath="/warehouses"><EditWarehouse /></PrivateRoute>} />
                    <Route path="bins/add" element={<PrivateRoute requiredPath="/bins"><AddBin /></PrivateRoute>} />
                    <Route path="bins/edit/:id" element={<PrivateRoute requiredPath="/bins"><EditBin /></PrivateRoute>} />
                    <Route path="product-location/add" element={<PrivateRoute requiredPath="/productlocation"><AddProductLocation /></PrivateRoute>} />
                    <Route path="product-location/edit/:id" element={<PrivateRoute requiredPath="/productlocation"><EditProductLocation /></PrivateRoute>} />
                    <Route path="zone/add" element={<PrivateRoute requiredPath="/zones"><AddZone /></PrivateRoute>} />
                    <Route path="zone/edit/:id" element={<PrivateRoute requiredPath="/zones"><EditZone /></PrivateRoute>} />
                    <Route path="products/add" element={<PrivateRoute requiredPath="/products"><AddProduct /></PrivateRoute>} />
                    <Route path="products/edit/:id" element={<PrivateRoute requiredPath="/products"><EditProduct /></PrivateRoute>} />
                    <Route path="users/add" element={<PrivateRoute requiredPath="/users"><AddUser /></PrivateRoute>} />
                    <Route path="users/edit/:id" element={<PrivateRoute requiredPath="/users"><EditUser /></PrivateRoute>} />
                    <Route path="categories/add" element={<PrivateRoute requiredPath="/categories"><AddCategory /></PrivateRoute>} />
                    <Route path="categories/edit/:id" element={<PrivateRoute requiredPath="/categories"><EditCategory /></PrivateRoute>} />
                    <Route path="import/add" element={<PrivateRoute requiredPath="/import"><AddImport /></PrivateRoute>} />
                    <Route path="import/edit/:id" element={<PrivateRoute requiredPath="/import"><EditImport /></PrivateRoute>} />
                    <Route path="export/add" element={<PrivateRoute requiredPath="/export"><AddExport /></PrivateRoute>} />
                    <Route path="export/edit/:id" element={<PrivateRoute requiredPath="/export"><EditExport /></PrivateRoute>} />
                    <Route path="adjustment/add" element={<PrivateRoute requiredPath="/adjustment"><AddAdjust /></PrivateRoute>} />
                    <Route path="adjustment/edit/:id" element={<PrivateRoute requiredPath="/adjustment"><EditAdjust /></PrivateRoute>} />
                    <Route path="transfer-out/add" element={<PrivateRoute requiredPath="/transfer-out"><AddTransferOut /></PrivateRoute>} />
                    <Route path="transfer-out/edit/:id" element={<PrivateRoute requiredPath="/transfer-out"><EditTransferOut /></PrivateRoute>} />
                </Route>

                {/* Authentication Routes */}
                <Route path="/auth" element={<AuthLayout />}>
                    <Route path="login" element={<Login />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
