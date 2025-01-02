import React, { useState } from 'react';
import api from '../axiosInstance';
import { ToastContainer, toast } from "react-toastify";

const FileUpload = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    const maxSize = 2 * 1024 * 1024;

    if (!file) {
      setErrorMessage("Please select a file.");
      setSelectedFile(null);
    } else if (!validTypes.includes(file.type)) {
      setErrorMessage("Invalid file type. Only PDF, JPG, JPEG, and PNG are allowed.");
      setSelectedFile(null);
    } else if (file.size > maxSize) {
      setErrorMessage("File size exceeds 2MB.");
      setSelectedFile(null);
    } else {
      setErrorMessage("");
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await api.post('/api/upload', formData);

        // console.success('File uploaded successfully:', response);
        toast.success('File uploaded successfully!');

        setErrorMessage("");
        setIsModalOpen(false);
      } catch (error) {
        setErrorMessage("File upload failed. Please try again.");
        // console.error(error);
      } finally {
        setIsUploading(false);
      }
    } else {
      setErrorMessage("Please select a valid file before uploading!");
    }
  };

  const handleButtonClick = () => {
    setIsButtonLoading(true);
    setTimeout(() => {
      setIsButtonLoading(false);
      setIsModalOpen(true);
    }, 1000);
  };

  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
        onClick={handleButtonClick}
      >
        {isButtonLoading ? (
          <span className="spinner-border w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        ) : (
          "Upload File"
        )}
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-2/4 md:w-2/4">
            {/* Modal Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold mb-4 text-gray-200">Upload File</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsModalOpen(false)}
              >
                ✖
              </button>
            </div>

            {/* File Input */}
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
              aria-label="File upload"
            />

            {/* Error Message */}
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}

            {/* Upload Button with Spinner */}
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center space-x-2"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading && (
                  <span className="spinner-border w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                <span>{isUploading ? "Uploading..." : "Upload"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />

    </>
  );
};

export default FileUpload;
