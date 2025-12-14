import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import userService from '../services/userService';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
 
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        role: '',
        isActive: true
    });
 
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            const currentUser = authService.getCurrentUser();
            if (!currentUser || !currentUser.userID) { 
                navigate('/auth/login');
                return;
            }
 
            const userData = await userService.getUserById(currentUser.userID);
            setUser(userData);
 
            setFormData({
                fullName: userData.fullName || '',
                email: userData.email || '',
                phone: userData.phone || '',
                role: userData.role || '',
                isActive: userData.isActive
            });

            setLoading(false);
        } catch (err) {
            console.error('Error loading user profile:', err);
            setError('Failed to load profile. Please try again.');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSaving(true);

        try {
            await userService.updateUser(user.userID, formData);
 
            const updatedUser = {
                ...authService.getCurrentUser(),
                fullName: formData.fullName,
                email: formData.email,
                role: formData.role
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setSuccess('Profile updated successfully!');
            await loadUserProfile();  
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
 
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setChangingPassword(true);

        try { 
            await userService.updateUser(user.userID, {
                ...formData,
                password: passwordData.newPassword
            });

            setSuccess('Password changed successfully!');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            console.error('Error changing password:', err);
            setError(err.response?.data?.message || 'Failed to change password. Please try again.');
        } finally {
            setChangingPassword(false);
        }
    };

    if (loading) {
        return (
            <div className="container-fluid">
                <div className="card">
                    <div className="card-body text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container-fluid">
                <div className="card">
                    <div className="card-body text-center py-5">
                        <p>Unable to load profile. Please <Link to="/auth/login">login again</Link>.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
            )}
            {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {success}
                    <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                </div>
            )}

            <div className="row">
                <div className="col-lg-4">
                    <div className="card">
                        <div className="card-body text-center">
                            <div className="mb-4">
                                <img src="/assets/images/profile/user-1.jpg" alt="Profile" className="rounded-circle" width="150" height="150" style={{ objectFit: 'cover' }} />
                            </div>
                            <h4 className="mb-1">{user.fullName}</h4>
                            <p className="text-muted mb-3">{user.role}</p>
                            <div className="d-flex justify-content-center gap-2 mb-3">
                                <span className={`badge ${user.isActive ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                                    {user.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="card mt-3">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Contact Information</h5>
                            <div className="mb-3">
                                <label className="text-muted small">Email</label>
                                <p className="mb-0">{user.email}</p>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small">Phone</label>
                                <p className="mb-0">{user.phone || 'Not provided'}</p>
                            </div>
                            <div className="mb-0">
                                <label className="text-muted small">User ID</label>
                                <p className="mb-0">#{user.userID}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title fw-semibold mb-4">Profile Information</h5>
                            <form onSubmit={handleUpdateProfile}>
                                <div className="mb-3">
                                    <label htmlFor="fullName" className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="phone" className="form-label">Phone</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="role" className="form-label">Role</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="role"
                                            name="role"
                                            value={formData.role}
                                            disabled
                                            readOnly
                                        />
                                        <small className="text-muted">Role cannot be changed from profile</small>
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-primary" disabled={saving}>
                                        {saving ? 'Updating...' : 'Update Profile'}
                                    </button>
                                    <Link to="/" className="btn btn-secondary">Cancel</Link>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="card mt-3">
                        <div className="card-body">
                            <h5 className="card-title fw-semibold mb-4">Change Password</h5>
                            <form onSubmit={handleChangePassword}>
                                <div className="mb-3">
                                    <label htmlFor="currentPassword" className="form-label">Current Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="currentPassword"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="newPassword" className="form-label">New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="newPassword"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        minLength={6}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        minLength={6}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={changingPassword}>
                                    {changingPassword ? 'Changing...' : 'Change Password'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
