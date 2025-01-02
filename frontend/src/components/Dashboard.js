import React, { useEffect, useState } from 'react';
import FileUpload from './FileUpload';
import Logout from '../components/Logout';
import FileList from '../components/FileList';

const Dashboard = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name || 'User');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
      <header className="flex justify-between items-center px-8 py-4 bg-purple-800 shadow-lg">
        <div className="flex space-x-4"></div>
        <div>
          <Logout />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 mt-10">
        <h1 className="text-4xl font-bold mb-4">Welcome, {userName}!</h1>
        <p className="text-lg mb-6 text-indigo-100">
          Here you can upload files, manage your documents, and explore more features.
        </p>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-purple-700 p-6 rounded-lg shadow-md hover:shadow-lg">
            <h2 className="text-2xl font-semibold mb-2">Upload Files</h2>
            <p className="text-indigo-200">Easily upload and manage your documents securely.</p>
            <div className="mt-4">
              <FileUpload />
            </div>
          </div>

          <div className="bg-purple-700 p-6 rounded-lg shadow-md hover:shadow-lg">
            <h2 className="text-2xl font-semibold mb-2">View Files</h2>
            <p className="text-indigo-200">Access and organize all your uploaded files.</p>
            <FileList />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-purple-800 text-center py-4">
        <p className="text-indigo-200">© {new Date().getFullYear()} Samir Randeriya. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
