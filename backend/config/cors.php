<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'], // Allows all HTTP methods (GET, POST, etc.)

    'allowed_origins' => ['http://localhost:3000'], // Your React app's origin

    'allowed_origins_patterns' => [],

    // 'allowed_headers' => ['*', 'Content-Type', 'X-Requested-With', 'Authorization', 'X-XSRF-TOKEN'], // Add any custom headers your app uses
    'allowed_headers' => ['*'], // Add any custom headers your app uses

    'exposed_headers' => false,

    'max_age' => 0,

    'supports_credentials' => true, // This is crucial for allowing credentials (cookies)

];
