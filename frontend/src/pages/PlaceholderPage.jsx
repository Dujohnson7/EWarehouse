import React from 'react';
import { useLocation } from 'react-router-dom';

const PlaceholderPage = () => {
    const location = useLocation();
    const pageName = location.pathname.slice(1).charAt(0).toUpperCase() + location.pathname.slice(2);

    return (
        <div className="card w-100">
            <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">{pageName || 'Page'} Page</h5>
                <div className="alert alert-info" role="alert">
                    This page ({location.pathname}) is currently under construction.
                </div>
                <p>
                    Functionality for <strong>{pageName}</strong> has not been ported from the HTML version yet.
                </p>
            </div>
        </div>
    );
};

export default PlaceholderPage;
