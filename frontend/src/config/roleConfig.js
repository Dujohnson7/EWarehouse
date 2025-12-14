const roleConfig = { 
    Admin: {
        denied: []
    }, 
    General_Manager: {
        denied: ['/users', '/audit']  
    }, 
    Manager: {
        denied: ['/users', '/roles', '/audit', '/settings','/warehouses']
    }, 
    Clerk: {
        denied: [
            '/users',
            '/warehouses',
            '/zones',
            '/categories',
            '/products',  
            '/audit',
            '/settings',
            '/dashboard',
            '/bin'
        ],
        allowed: [
            '/stockstatus',
            '/productlocation',
            '/import',
            '/export',
            '/transferin',
            '/transferout',
            '/adjust'
        ]
    }
};

export const canAccessPage = (role, path) => {
    if (!role) return false;
    if (role === 'Admin') return true;

    const config = roleConfig[role];
    if (!config) return false; 

    if (config.denied && config.denied.some(deniedPath => path.startsWith(deniedPath))) {
        return false;
    }
 
    return true;
};

export default roleConfig;
