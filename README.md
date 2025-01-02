# File Management System - Setup Instructions

## Frontend Setup (ReactJS)
1. Navigate to the `react-frontend` directory.
2. Run the following command to install dependencies:
```bash
    npm install
```
3. Start the React development server:
```bash
   npm run start
```

## Backend Setup (Laravel)
1. Navigate to the `laravel-api` directory.
2. Install dependencies using Composer:
```bash
   composer install
```
3. Run the database migrations:
```bash
   php artisan migrate
```
4. Start the Laravel server:
```bash
   php artisan serve
```
- The default backend server URL is: `http://127.0.0.1:8080`

## Integrating Frontend with Backend
1. Open the frontend project file located at:
```
   src/axiosInstance.js
```
2. Update the `baseURL` property to match your backend server URL:
```javascript
   const axiosInstance = axios.create({
       baseURL: 'http://127.0.0.1:8080', // Update with your server URL
   });
```