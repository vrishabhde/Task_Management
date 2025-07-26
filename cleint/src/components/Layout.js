import React, { useCallback, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaHome, FaTasks, FaPlus, FaUsers, FaSignOutAlt, FaBars, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const handleNavigation = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FaHome },
    { path: '/tasks', label: 'Tasks', icon: FaTasks },
    ...(user.role === 'admin' || user.role === 'manager' ? [{ path: '/tasks/new', label: 'Create Task', icon: FaPlus }] : []),
    ...(user.role === 'admin' || user.role === 'manager' ? [{ path: '/users', label: 'Manage Users', icon: FaUsers }] : [])
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {!isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(true)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 bg-gradient-to-b from-blue-600 to-blue-800 text-white transform transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'w-64' : 'w-16'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md hover:bg-white/10 transition-colors duration-200 mr-3"
              >
                {isSidebarOpen ? <FaChevronLeft className="w-5 h-5" /> : <FaChevronRight className="w-5 h-5" />}
              </button>
              <h2 className={`text-xl font-bold transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                TaskFlow
              </h2>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul>
              {menuItems.map((item) => (
                <li key={item.path} className="mb-2">
                  <button 
                    onClick={() => handleNavigation(item.path)} 
                    className={`group flex items-center w-full text-left p-2 hover:bg-white/10 rounded transition-colors duration-200 ${
                      location.pathname === item.path ? 'bg-white/20' : ''
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {isSidebarOpen && <span className="ml-3">{item.label}</span>}
                    {!isSidebarOpen && (
                      <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        {item.label}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="group flex items-center w-full p-2 text-white hover:bg-white/10 rounded transition-colors duration-200"
            >
              <FaSignOutAlt className="w-5 h-5" />
              {isSidebarOpen && <span className="ml-3">Logout</span>}
              {!isSidebarOpen && (
                <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Logout
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        {/* Titlebar */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 mr-4"
            >
              <FaBars className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">
              Welcome, {user.name} <span className="text-blue-600 text-lg font-normal">({user.role})</span>
            </h1>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
