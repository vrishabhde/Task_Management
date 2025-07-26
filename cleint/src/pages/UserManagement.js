//

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import { MdDelete } from "react-icons/md";
import ConfirmationModal from "../components/ConfirmationModal";
import Pagination from "../components/Pagination";
import { useAuth } from "../contexts/AuthContext";
import { getApiUrl } from '../config/api';

export default function UserManagement() {

  const [users, setUsers] = useState([]);
  const [currentuser, setCurrentuser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [managers, setManagers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({}); // ✅ role per user
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  useEffect(() => {
    const getuser = JSON.parse(localStorage.getItem('user'))
    setCurrentuser(getuser)
      console.log(getuser,"currentuser")
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(getApiUrl('/users'));
      setUsers(response.data);
      setManagers(response.data.filter((user) => user.role === "manager"));

      // ✅ Initialize selectedRoles with current user roles
      const initialRoles = {};
      response.data.forEach((user) => {
        initialRoles[user._id] = user.role;
      });
      setSelectedRoles(initialRoles);

      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch users");
      setLoading(false);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setSelectedRoles((prev) => ({ ...prev, [userId]: newRole }));
  };

  const deleteUser = async (userId) => {
    setModalConfig({
      isOpen: true,
      title: "Delete User",
      message:
        "Are you sure you want to delete this user? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await axios.delete(getApiUrl(`/users/${userId}`));
          toast.success('User deleted successfully');
          fetchUsers();
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
        } catch (error) {
          toast.error("Failed to delete user");
        }
      },
    });
  };

  const updateRole = async (userId) => {
    const newRole = selectedRoles[userId];
    const currentRole = users.find((user) => user._id === userId)?.role;

    // 🔐 Prevent update if role wasn't changed
    if (!newRole || newRole === currentRole) {
      return toast.warn("Please select a different role to update.");
    }

    setModalConfig({
      isOpen: true,
      title: "Update User Role",
      message: `Are you sure you want to change this user's role to ${newRole}?`,
      onConfirm: async () => {
        try {
        await axios.patch(getApiUrl(`/users/${userId}/role`), {
            role: newRole,
          });
          toast.success("User role updated successfully");
          fetchUsers();
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
        } catch (error) {
          toast.error("Failed to update user role");
        }
      },
    });
  };

  const handleManagerAssign = async (userId, managerId) => {
    try {
      if (managerId) {
        await axios.patch(getApiUrl(`/users/${userId}/manager`), {
          managerId,
        });
      } else {
        await axios.delete(getApiUrl(`/users/${userId}/manager`));
      }
      fetchUsers();
      toast.success("Manager assignment updated successfully");
    } catch (error) {
      toast.error("Failed to update manager assignment");
    }
  };

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900">
              User Management
            </h1>

            <div className="mt-8 flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          {(currentuser.role === 'admin') && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                          )}
                          {(currentuser.role === 'admin') && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Delete
                          </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentUsers.map((user) => (
                          <tr key={user._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </td>
                             {(currentuser.role === 'manager') && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {user.role}
                              </div>
                            </td>
                             )}
                              {(currentuser.role === 'admin') && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={selectedRoles[user._id] || "user"}
                                onChange={(e) =>
                                  handleRoleChange(user._id, e.target.value)
                                }
                                className="text-sm text-gray-900 border-gray-300 rounded-md"
                              >
                                <option value="user">User</option>
                                <option value="manager">Manager</option>
                                {/* <option value="admin">Admin</option> */}
                              </select>
                            </td>
                              )}
                               {(currentuser.role === 'admin') && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => updateRole(user._id)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition duration-200 text-sm"
                              >
                                Update
                              </button>
                            </td>
                               )}
                                {(currentuser.role === 'admin') && (
                            <td className="px-10 py-4 whitespace-nowrap">
                              <MdDelete
                                onClick={() => deleteUser(user._id)}
                                className="text-red-600 cursor-pointer hover:text-red-800 text-xl"
                              />
                            </td>
                                )}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                               {user.managerId ? (
                                <button
                                  onClick={() =>
                                    handleManagerAssign(user._id, null)
                                  }
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Remove Manager
                                </button>
                              ) : null}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Pagination */}
            {totalPages >= 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
        <ConfirmationModal
          isOpen={modalConfig.isOpen}
          onClose={closeModal}
          onConfirm={modalConfig.onConfirm}
          title={modalConfig.title}
          message={modalConfig.message}
        />
      </div>
    </Layout>
  );
}
