import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaArrowLeft, FaSpinner, FaCalendarAlt, FaUser, FaFlag, FaClock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { getApiUrl } from '../config/api';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const fetchTaskDetails = async () => {
    try {
      const response = await axios.get(getApiUrl(`/tasks/${id}`), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setTask(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch task details');
      toast.error('Failed to fetch task details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      const response = await axios.patch(
        getApiUrl(`/tasks/${id}/status`),
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setTask(response.data);
      toast.success('Task status updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status');
      toast.error('Failed to update task status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaClock className="w-5 h-5" />;
      case 'in_progress': return <FaExclamationCircle className="w-5 h-5" />;
      case 'completed': return <FaCheckCircle className="w-5 h-5" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <FaSpinner className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-red-600 p-4">
          Error: {error}
        </div>
      </Layout>
    );
  }

  if (!task) {
    return (
      <Layout>
        <div className="text-gray-600 p-4">
          Task not found
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {(user.role === 'admin' || user.role === 'manager') && (
            <button
              onClick={() => navigate(`/tasks/${id}/edit`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Edit Task
            </button>
          )}
        </div>

        {/* Task Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Task Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority} Priority
                </span>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  disabled={updating}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Task Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{task.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center text-gray-600 mb-1">
                      <FaUser className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Assigned To</span>
                    </div>
                    <p className="text-gray-900">{task.assignedTo?.name || 'Unassigned'}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center text-gray-600 mb-1">
                      <FaUser className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Created By</span>
                    </div>
                    <p className="text-gray-900">{task.createdBy?.name}</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaCalendarAlt className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Due Date</span>
                  </div>
                  <p className="text-gray-900">
                    {new Date(task.dueDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaClock className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Created At</span>
                  </div>
                  <p className="text-gray-900">
                    {new Date(task.createdAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaFlag className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Current Status</span>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(task.status)}
                    <span className="ml-2 text-gray-900 capitalize">{task.status.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TaskDetail; 