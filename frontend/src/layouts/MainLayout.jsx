import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const MainLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div
            className={`page-wrapper ${isSidebarOpen ? 'show-sidebar' : ''}`}
            id="main-wrapper"
            data-layout="vertical"
            data-navbarbg="skin6"
            data-sidebartype="full"
            data-sidebar-position="fixed"
            data-header-position="fixed"
        >
            <Sidebar onSidebarClose={() => setSidebarOpen(false)} />
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="offcanvas-backdrop fade show d-xl-none"
                    onClick={() => setSidebarOpen(false)}
                    style={{ zIndex: 9 }}
                ></div>
            )}
            <div className="body-wrapper">
                <Header onSidebarToggle={() => setSidebarOpen(!isSidebarOpen)} />
                <div className="body-wrapper-inner">
                    <div className="container-fluid">
                        <Outlet />
                        <div className="py-6 px-6 text-center">
                            <p className="mb-0 fs-4">Design and Developed by <a href="#">Group 4</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
