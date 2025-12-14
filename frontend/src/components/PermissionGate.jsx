import React from 'react';
import authService from '../services/authService';

const PermissionGate = ({ type, children }) => {
    // const user = authService.getCurrentUser();

    // if (!user) return null;

    // let hasPermission = false;

    // switch (type) {
    //     case 'insert':
    //         hasPermission = user.isInsert;
    //         break;
    //     case 'update':
    //         hasPermission = user.isUpdate;
    //         break;
    //     case 'delete':
    //         hasPermission = user.isDelete;
    //         break;
    //     default:
    //         hasPermission = false;
    // }

    // if (!hasPermission) return null;

    return <>{children}</>;
};

export default PermissionGate;
