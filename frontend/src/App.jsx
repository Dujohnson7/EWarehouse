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
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import TransferIn from './pages/TransferIn';
import TransferOut from './pages/TransferOut';
import Adjust from './pages/Adjust';
import AddAdjust from './pages/AddAdjust';
import EditAdjust from './pages/EditAdjust';
import AddTransferOut from './pages/AddTransferOut';
import EditTransferOut from './pages/EditTransferOut';

function App() {
    return (
        <Router>
            <Routes>
                {/* Main Application Routes */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Dashboard />} />
                    {/* Entity List Pages */}
                    <Route path="zone" element={<Zone />} />
                    <Route path="products" element={<Products />} />
                    <Route path="users" element={<Users />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="warehouse" element={<Warehouse />} />
                    <Route path="bins" element={<Bins />} />
                    <Route path="product-locations" element={<ProductLocations />} />
                    <Route path="product-locations/add" element={<AddProductLocation />} />
                    <Route path="product-locations/edit/:id" element={<EditProductLocation />} />
                    <Route path="stock-movements" element={<StockMovements />} />
                    <Route path="alerts" element={<Alerts />} />
                    <Route path="audit-logs" element={<AuditLogs />} />

                    {/* Add/Edit Forms */}
                    <Route path="zone/add" element={<AddZone />} />
                    <Route path="zone/edit/:id" element={<EditZone />} />
                    <Route path="products/add" element={<AddProduct />} />
                    <Route path="products/edit/:id" element={<EditProduct />} />
                    <Route path="users/add" element={<AddUser />} />
                    <Route path="users/edit/:id" element={<EditUser />} />
                    <Route path="categories/add" element={<AddCategory />} />
                    <Route path="categories/edit/:id" element={<EditCategory />} />
                    <Route path="warehouse/add" element={<AddWarehouse />} />
                    <Route path="warehouse/edit/:id" element={<EditWarehouse />} />
                    <Route path="bins/add" element={<AddBin />} />
                    <Route path="bins/edit/:id" element={<EditBin />} />

                    <Route path="stock" element={<Stock />} />
                    <Route path="import" element={<Import />} />
                    <Route path="import/add" element={<AddImport />} />
                    <Route path="import/edit/:id" element={<EditImport />} />

                    <Route path="export" element={<Export />} />
                    <Route path="export/add" element={<AddExport />} />
                    <Route path="export/edit/:id" element={<EditExport />} />

                    <Route path="adjust" element={<Adjust />} />
                    <Route path="adjust/add" element={<AddAdjust />} />
                    <Route path="adjust/edit/:id" element={<EditAdjust />} />

                    <Route path="transfer-in" element={<TransferIn />} />
                    <Route path="transfer-out" element={<TransferOut />} />
                    <Route path="transfer-out/add" element={<AddTransferOut />} />
                    <Route path="transfer-out/edit/:id" element={<EditTransferOut />} />

                    <Route path="reports" element={<Reports />} />

                    <Route path="profile" element={<Profile />} />
                </Route>

                {/* Authentication Routes */}
                <Route path="/auth" element={<AuthLayout />}>
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
