import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [email, setEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await authService.forgotPassword(email);
            setSuccess('OTP sent to your email successfully!');
            setStep(2);
        } catch (err) {
            console.error('Send OTP error:', err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to send OTP. Please check your email and try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate passwords match
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Validate password strength
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            await authService.resetPassword(email, otpCode, newPassword);
            setSuccess('Password reset successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/auth/login');
            }, 2000);
        } catch (err) {
            console.error('Reset password error:', err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to reset password. Please check your OTP and try again.');
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
            <p className="text-center fw-semibold fs-4 mb-4">Forgot Password</p>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {step === 1 ? (
                <form onSubmit={handleSendOTP}>
                    <div className="mb-3">
                        <p className="mb-0 fs-3">Enter your email address to receive an OTP.</p>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2"
                        disabled={loading}
                    >
                        {loading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleResetPassword}>
                    <div className="mb-3">
                        <label htmlFor="otp" className="form-label">Enter OTP</label>
                        <input
                            type="text"
                            className="form-control"
                            id="otp"
                            placeholder="Enter 6-digit OTP"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            required
                            disabled={loading}
                            maxLength={6}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">New Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            disabled={loading}
                            minLength={6}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={loading}
                            minLength={6}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2"
                        disabled={loading}
                    >
                        {loading ? 'Resetting Password...' : 'Reset Password'}
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-secondary w-100 py-8 fs-4 mb-4 rounded-2"
                        onClick={() => setStep(1)}
                        disabled={loading}
                    >
                        Back to Email
                    </button>
                </form>
            )}

            <div className="d-flex align-items-center justify-content-center">
                <Link className="text-primary fw-bold ms-2" to="/auth/login">Back to Login</Link>
            </div>
        </>
    );
};

export default ForgotPassword;
