import React, { useState } from 'react';
import api from '../axiosInstance';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Logout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await api.get('/sanctum/csrf-cookie');
      await api.post('/api/logout');
      toast.success('Logout successful');
      localStorage.removeItem('authToken');

      setTimeout(() => navigate('/login'), 1000);
    } catch (error) {
      toast.error("Logout failed! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleLogout}
        disabled={isLoading} // Disable button while loading
        className={`py-2 px-4 rounded transition duration-300 ${
          isLoading
            ? 'bg-red-300 cursor-not-allowed'
            : 'bg-red-500 text-white hover:bg-red-600'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
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
          'Logout'
        )}
      </button>
      <ToastContainer />
    </>
  );
};

export default Logout;
