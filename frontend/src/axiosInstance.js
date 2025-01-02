// import axios from 'axios';

// // Create an Axios instance with base configuration
// const api = axios.create({
//     baseURL: 'http://127.0.0.1:8080/api', // Laravel API URL
//     withCredentials: true, // Required for Laravel Sanctum
// });

// // Add a response interceptor for handling errors globally
// api.interceptors.response.use(
//     response => response, // Return response if successful
//     error => {
//       if (error.response) {
//         const message = error.response.data.message || 'An error occurred';
//         alert(`Error: ${message}`);
//       } else {
//         alert('Network Error. Please try again.');
//       }
//       return Promise.reject(error);
//     }
// );

// export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8080', // Ensure the correct Laravel API URL
  withCredentials: true, // Required for CSRF handling
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;