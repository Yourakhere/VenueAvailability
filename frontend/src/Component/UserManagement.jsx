import React, { useEffect, useState } from "react";
import { Search, Plus, Edit3, Trash2, Users, Filter, RefreshCw, Upload, X, FileUp, CheckCircle } from "lucide-react";
import AddUserModal from "./Admin/UserMangement/AddUserModal"; 
import axiosInstance from "../Config/apiconfig.js"; 
import UpdateUserModal from "./Admin/UserMangement/UpdateUserModal";
import Loader from "./Loader.jsx";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function UserManagement() {
  const { user } = useSelector(state => state.auth);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [addUserModal, setAddUserModal] = useState(false);
  const [updateUserModal, setUpdateUserModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/users`); 
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = !search || 
      user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      user?.email?.toLowerCase().includes(search.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user?.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const deleteUserhandle = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      setDeleteLoading(id);
      await axiosInstance.delete(`/users/delete/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      toast.success("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user", err);
      toast.error("Failed to delete user");
    } finally {
      setDeleteLoading(null);
    }
  };

  const updateUserhandle = (id) => {
    setSelectedUserId(id);  
    setUpdateUserModal(true);
  };

  const handleAddUserSuccess = (newUser) => {
    setUsers(prev => [...prev, newUser]);
    setAddUserModal(false);
    toast.success("User added successfully");
  };

  const handleUpdateUserSuccess = (updatedUser) => {
    setUsers(prev => 
      prev.map(u => u._id === updatedUser._id ? updatedUser : u)
    );
    setUpdateUserModal(false);
    toast.success("User updated successfully");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      if (validTypes.includes(file.type)) {
        setUploadFile(file);
      } else {
        toast.error("Please upload a CSV or Excel file");
      }
    }
  };

  const handleUploadTimeSlots = async () => {
    if (!uploadFile) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      setUploadLoading(true);
      const res = await axiosInstance.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      toast.success("Time slots uploaded successfully!");
      setUploadFile(null);
      setUploadModal(false);
      
      document.getElementById("fileInput").value = "";
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(error.response?.data?.message || "Failed to upload time slots");
    } finally {
      setUploadLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'superadmin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'user':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'moderator':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  if (addUserModal) {
    return (
      <AddUserModal
        addUserModal={addUserModal}
        onClose={() => setAddUserModal(false)}
        onSuccess={handleAddUserSuccess}
      />
    );
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 text-sm">Manage users and their permissions</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 flex-wrap">
            <button
              onClick={getUsers}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            {user?.role === "superadmin" && (
              <button
                onClick={() => setUploadModal(true)}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Time Table</span>
              </button>
            )}
            
            <button
              onClick={() => setAddUserModal(true)}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-4 w-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[140px]"
            >
              <option value="all">All Roles</option>
              <option value="superadmin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">{filteredUsers.length}</span> users found
            </span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers && filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr 
                    key={user?._id} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user?.name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">ID: {user?._id?.slice(-6) || 'N/A'}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-gray-900">{user?.email || 'N/A'}</div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user?.role)}`}>
                        {user?.role?.charAt(0)?.toUpperCase() + user?.role?.slice(1) || 'N/A'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => deleteUserhandle(user?._id)}
                          disabled={deleteLoading === user?._id}
                          className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete user"
                        >
                          {deleteLoading === user?._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">No users found</h3>
                        <p className="text-gray-500 mt-1">
                          {search || roleFilter !== "all" 
                            ? "Try adjusting your search criteria" 
                            : "Get started by adding your first user"
                          }
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {uploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileUp className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Upload Time Table</h2>
              </div>
              <button
                onClick={() => {
                  setUploadModal(false);
                  setUploadFile(null);
                  document.getElementById("fileInput").value = "";
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-6">
              Upload your time table file (CSV or Excel) to add time slots to the system.
            </p>

            {/* File Upload Area */}
            <div className="mb-6">
              <label htmlFor="fileInput" className="block">
                <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    {uploadFile ? (
                      <>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-gray-900">{uploadFile.name}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {(uploadFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Upload className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-gray-900">Click to upload</p>
                          <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">CSV or Excel file (XLS, XLSX)</p>
                      </>
                    )}
                  </div>
                  <input
                    id="fileInput"
                    type="file"
                    accept=".csv,.xls,.xlsx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </label>
            </div>

            {/* File Info */}
            {uploadFile && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900">
                  ✓ File ready to upload. Click the Upload button to proceed.
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setUploadModal(false);
                  setUploadFile(null);
                  document.getElementById("fileInput").value = "";
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadTimeSlots}
                disabled={!uploadFile || uploadLoading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {uploadLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update User Modal */}
      {updateUserModal && (
        <UpdateUserModal
          userId={selectedUserId}
          isOpen={updateUserModal}
          onClose={() => setUpdateUserModal(false)}
          onSuccess={handleUpdateUserSuccess}
        />
      )}
    </div>
  );
}