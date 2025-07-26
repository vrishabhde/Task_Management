import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import { getApiUrl } from '../config/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    inprogressTasks: 0,
    upcomingDeadlines: [],
  });
  const [statsUser, setStatsUser] = useState({
    totalUsers: 0,
    totalManagers: 0,
    totalRoleUsers: 0,
    totalAdmin: 0,
  });

  const [currentUserName, setCurrentUserName] = useState("");
  const [showLogout, setShowLogout] = React.useState(false);
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    const userString = localStorage.getItem("user");

    if (userString) {
      const user = JSON.parse(userString);
      const firstName = user.name ? user.name.split(" ")[0] : "";
      setCurrentUserName(capitalize(firstName));
    }
    fetchDashboardData();
  }, []);

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if(user?.role === 'admin'){

      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(getApiUrl('/users'));
      setUsers(response.data);
      setManagers(response.data.filter((user) => user.role === "manager"));
      console.log(response.data, "checkresponse");
      const users = response.data;
      const stats = {
        totalUsers: users.length,
        totalManagers: users.filter((user) => user.role === "manager").length,
        totalRoleUsers: users.filter((user) => user.role === "user").length,
        totalAdmin: users.filter((user) => user.role === "admin").length,
      };

      setStatsUser(stats);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const handleLogout = async () => {
    try {
      await logout(); // call your auth logout
      navigate("/login"); // navigate after logout
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(getApiUrl('/tasks'));
      const tasks = response.data;

      const stats = {
        totalTasks: tasks.length,
        pendingTasks: tasks.filter((task) => task.status === "pending").length,
        completedTasks: tasks.filter((task) => task.status === "completed")
          .length,
        inprogressTasks: tasks.filter((task) => task.status === "in_progress")
          .length,
        upcomingDeadlines: tasks
          .filter((task) => task.status !== "completed")
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
          .slice(0, 5),
      };

      setStats(stats);
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="p-6">
              {/* <div className="flex justify-between space-x-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome To Dashboard {currentUserName}
                </h1>

                <div className="relative">
                  <button
                    onClick={() => setShowLogout((prev) => !prev)}
                    className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer select-none"
                    aria-label="User menu"
                  >
                    {currentUserName.charAt(0)}
                  </button>

                  {showLogout && (
                    <div className="absolute right-0 mt-2 w-28 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div> */}
            </div>
            {user?.role === 'admin' && (
            <div className="mt-0 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total App User"
                value={statsUser.totalUsers}
                bgColor="bg-amber-500"
                textColor="text-white"
              />
              <StatCard
                title="Total Managers"
                value={statsUser.totalManagers}
                bgColor="bg-rose-500"
                textColor="text-white"
              />
              <StatCard
                title="Total users"
                value={statsUser.totalRoleUsers}
                bgColor="bg-pink-500"
                textColor="text-white"
              />
              <StatCard
                title="Total Admin"
                value={statsUser.totalAdmin}
                bgColor="bg-purple-500"
                textColor="text-white"
              />
            </div>
            )}
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Tasks"
                value={stats.totalTasks}
                bgColor="bg-blue-500"
                textColor="text-white"
              />
              <StatCard
                title="Pending Tasks"
                value={stats.pendingTasks}
                bgColor="bg-yellow-500"
                textColor="text-white"
              />
              <StatCard
                title="Completed Tasks"
                value={stats.completedTasks}
                bgColor="bg-green-500"
                textColor="text-white"
              />
              <StatCard
                title="Inprogress Tasks"
                value={stats.inprogressTasks}
                bgColor="bg-orange-500"
                textColor="text-white"
              />
            </div>

            {/* Upcoming Deadlines */}
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900">
                Upcoming Deadlines
              </h2>
              <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {stats.upcomingDeadlines.map((task) => (
                    <li key={task._id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-blue-600 truncate">
                              {task.title}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                task.priority === "high"
                                  ? "bg-red-100 text-red-800"
                                  : task.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            {/* <div className="mt-8 flex space-x-4">
              <Link
                to="/tasks"
                className="btn-primary"
              >
                View All Tasks
              </Link>
              
              {(user.role === 'admin' || user.role === 'manager') && (
                <Link
                  to="/tasks/new"
                  className="btn-secondary"
                >
                  Create New Task
                </Link>
              )}
              
              {user.role === 'admin' && (
                <Link
                  to="/users"
                  className="btn-secondary"
                >
                  Manage Users
                </Link>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </Layout>
  );
}
