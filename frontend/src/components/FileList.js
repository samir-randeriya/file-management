import React, { useState } from "react";
import api from "../axiosInstance";
import { ToastContainer, toast } from "react-toastify";

const parseDate = (dateStr) => {
    let parsedDate = null;
    const dateFormats = ["DD-MM-YYYY", "YYYY-MM-DD", "YYYY-DD-MM"];
    for (const format of dateFormats) {
        parsedDate = parseDateWithFormat(dateStr, format);
        if (parsedDate) return parsedDate;
    }
    return parsedDate;
};

const parseDateWithFormat = (dateStr, format) => {
    const regex = format
        .replace("YYYY", "(\\d{4})")
        .replace("MM", "(\\d{2})")
        .replace("DD", "(\\d{2})");

    const match = new RegExp(regex).exec(dateStr);
    if (!match) return null;

    const [_, year, month, day] = match;

    switch (format) {
        case "DD-MM-YYYY":
            return new Date(`${year}-${month}-${day}`);
        case "YYYY-MM-DD":
            return new Date(dateStr);
        case "YYYY-DD-MM":
            return new Date(`${year}-${month}-${day}`);
        default:
            return null;
    }
};

const parseFileSize = (sizeStr) => {
    const sizeRegex = /(\d+\.?\d*)\s*(KB|MB|GB|B)/i;
    const match = sizeStr.match(sizeRegex);
    if (!match) return null;
    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();

    switch (unit) {
        case "B":
            return value;
        case "KB":
            return value * 1024;
        case "MB":
            return value * 1024 * 1024;
        case "GB":
            return value * 1024 * 1024 * 1024;
        default:
            return null;
    }
};

const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    else if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    else return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

const FileList = () => {
    const [files, setFiles] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(5);

    const fetchFiles = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/api/files");
            setFiles(response.data.files);
            toast.success("Files fetched successfully.")
            setErrorMessage("");
        } catch (error) {
            setErrorMessage("Failed to fetch files. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelection = (fileName) => {
        setSelectedFiles((prevSelected) =>
            prevSelected.includes(fileName)
                ? prevSelected.filter((name) => name !== fileName)
                : [...prevSelected, fileName]
        );
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDeleteSelected = async () => {
        if (!window.confirm("Are you sure you want to delete the selected files?")) return;

        try {
            await api.delete("/api/files", {
                data: {
                    files: selectedFiles
                }
            });

            setFiles((prevFiles) => prevFiles.filter((file) => !selectedFiles.includes(file.file_name)));
            setSelectedFiles([]);
            toast.success("Selected files deleted successfully!");
        } catch (error) {
            setErrorMessage("Failed to delete selected files. Please try again.");
            // console.error(error);
        }
    };

    const filterFiles = () => {
        return files.filter((file) => {
            const lowerCaseQuery = searchQuery.toLowerCase();
            if (file.file_name.toLowerCase().includes(lowerCaseQuery)) return true;
            const parsedDate = parseDate(searchQuery);
            if (parsedDate) {
                const fileDate = new Date(file.upload_time);
                if (fileDate && fileDate.getTime() === parsedDate.getTime()) {
                    return true;
                }
            }

            const parsedSize = parseFileSize(searchQuery);
            if (parsedSize && file.file_size) {
                if (file.file_size <= parsedSize) {
                    return true;
                }
            }
            return false;
        });
    };

    const paginateFiles = () => {
        const filteredFiles = filterFiles();
        const indexOfLastRecord = currentPage * recordsPerPage;
        const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
        return filteredFiles.slice(indexOfFirstRecord, indexOfLastRecord);
    };

    const totalPages = Math.ceil(filterFiles().length / recordsPerPage);

    return (
        <>
            <button
                onClick={() => {
                    setIsModalOpen(true);
                    fetchFiles();
                }}
                className="inline-block mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
            >
                View File List
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-3/4 h-auto md:w-3/4">
                        <h2 className="text-2xl font-bold mb-4 text-gray-200">Uploaded Files</h2>

                        {/* Search and Delete Buttons Container */}
                        <div className="mb-4 flex justify-between items-center">
                            {/* Delete Button (Left side, visible even if disabled) */}
                            <button
                                onClick={handleDeleteSelected}
                                disabled={selectedFiles.length === 0}
                                className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ${selectedFiles.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Delete Selected
                            </button>

                            {/* Search Box (Right side) */}
                            <input
                                type="text"
                                placeholder="Search by name, date, or size"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="p-2 rounded-md bg-gray-700 text-white w-1/4"
                            />
                        </div>

                        {isLoading ? (
                            // Spinner while loading
                            <div className="flex justify-center py-4">
                                <div className="animate-spin border-4 border-t-4 border-indigo-500 border-solid w-12 h-12 rounded-full"></div>
                            </div>
                        ) : errorMessage ? (
                            <p className="text-center text-red-500">{errorMessage}</p>
                        ) : files.length === 0 ? (
                            <p className="text-center text-gray-400">No files uploaded yet.</p>
                        ) : (
                            <>
                                <table className="w-full table-auto border-collapse text-gray-300">
                                    <thead>
                                        <tr className="bg-gray-700">
                                            <th className="px-4 py-2 text-left">
                                                <input
                                                    type="checkbox"
                                                    onChange={(e) => {
                                                        setSelectedFiles(e.target.checked ? paginateFiles().map((file) => file.file_name) : []);
                                                    }}
                                                    checked={selectedFiles.length === paginateFiles().length}
                                                />
                                            </th>
                                            <th className="px-4 py-2 text-left">File Name</th>
                                            <th className="px-4 py-2 text-left">Size</th>
                                            <th className="px-4 py-2 text-left">Date</th>
                                            <th className="px-4 py-2 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginateFiles().map((file) => (
                                            <tr key={file.file_name} className="border-t border-gray-600">
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedFiles.includes(file.file_name)}
                                                        onChange={() => handleFileSelection(file.file_name)}
                                                    />
                                                </td>
                                                <td className="px-4 py-2">{file.file_name}</td>
                                                <td className="px-4 py-2">{formatFileSize(file.file_size)}</td>
                                                <td className="px-4 py-2">{file.upload_time}</td>
                                                <td className="px-4 py-2 flex space-x-2">
                                                    <a
                                                        href={file.file_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-400 hover:text-blue-600"
                                                    >
                                                        View
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Pagination Controls */}
                                <div className="flex justify-end mt-4 text-sm">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="bg-indigo-500 text-white px-4 py-2 rounded-md"
                                    >
                                        &lt;
                                    </button>
                                    <span className="text-white mx-4 mt-2">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="bg-indigo-500 text-white px-4 py-2 rounded-md"
                                    >
                                        &gt;
                                    </button>
                                </div>
                            </>
                        )}

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </>
    );
};

export default FileList;
