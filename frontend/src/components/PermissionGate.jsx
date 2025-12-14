import React from 'react';
import authService from '../services/authService';

const PermissionGate = ({ type, children }) => {
    const { isInsert, isUpdate, isDelete } = authService.getUserPermissions();

    let hasPermission = false;

    switch (type) {
        case 'insert':
            hasPermission = isInsert;
            break;
        case 'update':
            hasPermission = isUpdate;
            break;
        case 'delete':
            hasPermission = isDelete;
            break;
        default:
            hasPermission = false;
    }

    if (!hasPermission) return null;

    return <>{children}</>;
};

export default PermissionGate;
