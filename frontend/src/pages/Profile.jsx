import React from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-4">
                    <div className="card">
                        <div className="card-body text-center">
                            <div className="mb-4">
                                <img src="/assets/images/profile/user-1.jpg" alt="Profile" className="rounded-circle" width="150" height="150" style={{ objectFit: 'cover' }} />
                            </div>
                            <h4 className="mb-1">John Doe</h4>
                            <p className="text-muted mb-3">Administrator</p>
                            <div className="d-flex justify-content-center gap-2 mb-3">
                                <span className="badge bg-success-subtle text-success">Active</span>
                            </div>
                            <div className="mt-4">
                                <button className="btn btn-primary btn-sm">
                                    <i className="ti ti-camera me-1"></i> Change Photo
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="card mt-3">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Contact Information</h5>
                            <div className="mb-3">
                                <label className="text-muted small">Email</label>
                                <p className="mb-0">dujohnson@gmail.com</p>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small">Phone</label>
                                <p className="mb-0">0792104882</p>
                            </div>
                            <div className="mb-0">
                                <label className="text-muted small">Location</label>
                                <p className="mb-0">Kigali, Rwanda</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title fw-semibold mb-4">Profile Information</h5>
                            <form>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="firstName" className="form-label">First Name</label>
                                        <input type="text" className="form-control" id="firstName" defaultValue="Dujohnson" />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="lastName" className="form-label">Last Name</label>
                                        <input type="text" className="form-control" id="lastName" defaultValue="Johnson" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input type="email" className="form-control" id="email" defaultValue="dujohnson@gmail.com" />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="phone" className="form-label">Phone</label>
                                        <input type="tel" className="form-control" id="phone" defaultValue="0792104882" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="role" className="form-label">Role</label>
                                        <select className="form-select" id="role" defaultValue="admin">
                                            <option value="admin">Administrator</option>
                                            <option value="user">User</option>
                                            <option value="manager">Manager</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="status" className="form-label">Status</label>
                                        <select className="form-select" id="status" defaultValue="active">
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label">Address</label>
                                    <textarea className="form-control" id="address" rows="2" defaultValue="123 Main Street, Kigali, Rwanda"></textarea>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="city" className="form-label">City</label>
                                        <input type="text" className="form-control" id="city" defaultValue="Kigali" />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="country" className="form-label">Country</label>
                                        <input type="text" className="form-control" id="country" defaultValue="Rwanda" />
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-primary">Update Profile</button>
                                    <Link to="/" className="btn btn-secondary">Cancel</Link>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="card mt-3">
                        <div className="card-body">
                            <h5 className="card-title fw-semibold mb-4">Change Password</h5>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="currentPassword" className="form-label">Current Password</label>
                                    <input type="password" className="form-control" id="currentPassword" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="newPassword" className="form-label">New Password</label>
                                    <input type="password" className="form-control" id="newPassword" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                                    <input type="password" className="form-control" id="confirmPassword" />
                                </div>
                                <button type="submit" className="btn btn-primary">Change Password</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
