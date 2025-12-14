import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login(email, password);
            // Login successful, redirect to dashboard
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            // Better error message handling
            if (err.response?.status === 401) {
                setError('Invalid email or password');
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Link to="/" className="text-nowrap logo-img text-center d-block py-3 w-100">
                <img src="/assets/images/logo.png" width="180" alt="" />
            </Link>
            <p className="text-center">Your Social Campaigns</p>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Username</label>
                    <input
                        type="email"
                        className="form-control"
                        id="exampleInputEmail1"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="exampleInputPassword1"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="form-check">
                        <input className="form-check-input primary" type="checkbox" value="" id="flexCheckChecked" defaultChecked />
                        <label className="form-check-label text-dark" htmlFor="flexCheckChecked">
                            Remember this Device
                        </label>
                    </div>
                    <Link className="text-primary fw-bold" to="/auth/forgot-password">Forgot Password ?</Link>
                </div>
                <button type="submit" className="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2" disabled={loading}>
                    {loading ? 'Signing In...' : 'Sign In'}
                </button>
                <div className="d-flex align-items-center justify-content-center">
                    <p className="fs-4 mb-0 fw-bold">New to MaterialM?</p>
                    <Link className="text-primary fw-bold ms-2" to="/auth/register">Create an account</Link>
                </div>
            </form>
        </>
    );
};

export default Login;
