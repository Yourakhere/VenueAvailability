import { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Calendar, Building2, Loader2 } from 'lucide-react';
import axiosInstance from '../Config/apiconfig';

const TimetableUpload = () => {
  const [selectedBlock, setSelectedBlock] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleBlockChange = (e) => {
    setSelectedBlock(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    const validExtensions = ['xlsx', 'xls', 'csv'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (validExtensions.includes(fileExtension)) {
      setSelectedFile(file);
      setUploadStatus('');
    } else {
      setSelectedFile(null);
      setUploadStatus('Please select a valid Excel file (.xlsx, .xls, .csv)');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedBlock) {
      setUploadStatus('Please select a block');
      return;
    }

    if (!selectedFile) {
      setUploadStatus('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setUploadStatus('Uploading...');

    try {
      const formData = new FormData();
      formData.append('excel_file', selectedFile);
      formData.append('block', selectedBlock);

      // Simulated API call - replace with your actual endpoint
      
      const response = await axiosInstance.post('/upload',formData,{
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

      if (response.ok) {
        setUploadStatus('Timetable uploaded successfully!');
        setSelectedBlock('');
        setSelectedFile(null);
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.value = '';
      } else {
        setUploadStatus('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading timetable:', error);
      setUploadStatus('An error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50  py-8 px-2">
      {/* Header Section */}
      <div className="text-center mb-12 max-w-4xl mx-auto">
   
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          Upload <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Timetable</span>
        </h1>
        <p className="text-md text-gray-600 max-w-2xl mx-auto">
          Streamline your timetable management and optimize resource utilization. Upload and manage venue schedules in minutes.
        </p>
      </div>

      {/* Main Upload Card */}
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Card Header */}


          {/* Card Body */}
          <div className="p-6 space-y-6">
            {/* Block Selection */}
            <div>
              <label htmlFor="block-select" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Building2 className="h-4 w-4 text-blue-600" />
                Select Block
              </label>
              <select 
                id="block-select"
                name='block'
                value={selectedBlock} 
                onChange={handleBlockChange}
                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 cursor-pointer"
              >
                <option value="">-- Select Block --</option>
                <option value="ET BLOCK">ET Block</option>
                <option value="MT BLOCK">MT Block</option>
              </select>
            </div>
            
            {/* File Upload Area */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                Upload Excel File
              </label>
              <div 
                className={`relative border-3 border-dashed rounded-2xl transition-all duration-300 ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50' 
                    : selectedFile
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="px-6 py-10">
                  <div className="flex flex-col items-center space-y-4">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300 ${
                      selectedFile 
                        ? 'bg-green-100' 
                        : 'bg-blue-100'
                    }`}>
                      {selectedFile ? (
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      ) : (
                        <Upload className="h-8 w-8 text-blue-600" />
                      )}
                    </div>

                    {/* Text */}
                    <div className="text-center">
                      <label
                        htmlFor="file-input"
                        className="relative cursor-pointer"
                      >
                        <span className="text-blue-600 hover:text-blue-700 font-semibold text-lg">
                          Click to upload
                        </span>
                        <input
                          id="file-input"
                          name="excel_file"
                          type="file"
                          className="sr-only"
                          accept=".xlsx, .xls, .csv"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="text-gray-500 mt-1">or drag and drop</p>
                    </div>

                    {/* File Info */}
                    {selectedFile ? (
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-lg border border-green-200">
                        <FileSpreadsheet className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-green-700">{selectedFile.name}</span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">
                        XLSX, XLS, or CSV up to 10MB
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Upload Button */}
            <button 
              onClick={handleUpload}
              disabled={isUploading || !selectedBlock || !selectedFile}
              className="w-full flex justify-center items-center gap-3 py-4 px-6 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:scale-100 disabled:shadow-none"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  <span>Upload Timetable</span>
                </>
              )}
            </button>
            
            {/* Status Message */}
            {uploadStatus && (
              <div className={`rounded-xl p-4 border-2 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                uploadStatus.includes('successfully') 
                  ? 'bg-green-50 border-green-200' 
                  : uploadStatus.includes('Uploading')
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                {uploadStatus.includes('successfully') ? (
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : uploadStatus.includes('Uploading') ? (
                  <Loader2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5 animate-spin" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <p className={`text-sm font-medium ${
                  uploadStatus.includes('successfully') 
                    ? 'text-green-800' 
                    : uploadStatus.includes('Uploading')
                    ? 'text-blue-800'
                    : 'text-red-800'
                }`}>
                  {uploadStatus}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TimetableUpload;