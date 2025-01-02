import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import api from '../axiosInstance';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state) {
            const { email: registeredEmail, password: registeredPassword } = location.state;
            if (registeredEmail) setEmail(registeredEmail);
            if (registeredPassword) setPassword(registeredPassword);
        }
    }, [location.state]);

    if (localStorage.getItem('authToken')) {
        return <Navigate to="/dashboard" />;
    }

    const fetchCsrfToken = async () => {
        try {
            await api.get('/sanctum/csrf-cookie');
        } catch (error) {
            toast.error("Error fetching CSRF token!");
            setErrorMessage('Failed to fetch CSRF token. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsLoading(true);

        try {
            await fetchCsrfToken();
            const { data } = await api.post('/api/login', { email, password });

            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            toast.success("Login successful.");
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (error) {
            toast.error("Login failed!");
            if (error.response) {
                const errorData = error.response.data.errors || { message: 'Login failed!' };
                const message = Object.values(errorData).flat().join(', ');
                setErrorMessage(message);
            } else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
                    {errorMessage && <p className="text-red-600 text-sm mb-4">{errorMessage}</p>}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 rounded transition duration-300 ${
                            isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                    >
                        {isLoading ? (
                            <div className="flex justify-center items-center">
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8H4z"
                                    ></path>
                                </svg>
                            </div>
                        ) : (
                            'Login'
                        )}
                    </button>
                    <p className="text-center text-sm text-gray-600 mt-4">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-500 hover:underline">
                            Register here
                        </Link>
                    </p>
                </form>
            </div>
            <ToastContainer />
        </>
    );
};

export default Login;
