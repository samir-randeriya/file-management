<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class FileController extends Controller
{
    public function uploadFile(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        $user = auth()->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $file = $request->file('file');
        $fileName = $file->getClientOriginalName();
        $filePath = 'uploads/' . $user->id . '/' . $fileName;
        $file->storeAs('public/uploads/' . $user->id . '/', $fileName);

        return response()->json(['message' => 'File uploaded successfully', 'file_name' => $fileName]);
    }

    public function fetchFile()
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $directoryPath = 'uploads/' . $user->id;
        if (!Storage::disk('public')->exists($directoryPath)) {
            return response()->json(['error' => 'No files found'], 404);
        }

        $fileDetails = [];
        $files = Storage::disk('public')->files($directoryPath);
        foreach ($files as $file) {
            $fileName = basename($file);
            $fileSize = Storage::disk('public')->size($file);
            $fileUrl = URL::to(Storage::url($file));
            $fileTimestamp = Storage::disk('public')->lastModified($file);

            $fileDetails[] = [
                'file_name' => $fileName,
                'file_size' => $fileSize,
                'file_url' => $fileUrl,
                'upload_time' => date('Y-m-d H:i:s', $fileTimestamp),
                'file_id' => uniqid()
            ];
        }

        usort($fileDetails, function ($a, $b) {
            return strtotime($b['upload_time']) - strtotime($a['upload_time']);
        });

        return response()->json(['files' => $fileDetails]);
    }

    public function deleteFiles(Request $request)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        
        $fileNames = $request->input('files');

        // Validate that the input is an array of strings
        if (!is_array($fileNames) || empty($fileNames)) {
            return response()->json(['error' => 'Invalid file names'], 400);
        }

        // Loop through the file names and attempt to delete them
        foreach ($fileNames as $fileName) {
            $filePath = 'uploads/' . $user->id . '/' . $fileName;

            if (!Storage::disk('public')->exists($filePath)) {
                return response()->json(['error' => "File $fileName not found"], 404);
            }

            // Delete the file
            Storage::disk('public')->delete($filePath);
        }

        // Check if the user's directory is empty, then delete the directory
        $userDirectoryPath = 'uploads/' . $user->id;

        // Check if the directory exists and is empty
        if (Storage::disk('public')->exists($userDirectoryPath) && empty(Storage::disk('public')->files($userDirectoryPath))) {
            // Delete the user's directory if it's empty
            Storage::disk('public')->deleteDirectory($userDirectoryPath);
        }

        return response()->json(['message' => 'Files deleted successfully. User directory removed if empty.']);
    }
}
