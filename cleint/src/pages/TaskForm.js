import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { getApiUrl } from '../config/api';

export default function TaskForm() {
   const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
    reminderAt: '',
    assignedTo: ''
  });

  const fetchTask = useCallback(async () => {
    try {
      console.log(user,"ididididi")
      const response = await axios.get(getApiUrl(`/tasks/${id}`), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const task = response.data;

      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: new Date(task.dueDate).toISOString().split('T')[0],
        reminderAt: new Date(task.reminderAt).toISOString().split('T')[0],
        assignedTo: task.assignedTo?._id || ''
      });
    } catch (error) {
      toast.error('Failed to fetch task');
      navigate('/tasks');
    }
  }, [id, navigate]);


  // const fetchTask = useCallback(async () => {
  //   try {
  //     const response = await axios.put(`http://localhost:5000/api/tasks/${id}`);
  //     const task = response.data;
  //     setFormData({
  //       title: task.title,
  //       description: task.description,
  //       status: task.status,
  //       priority: task.priority,
  //       dueDate: new Date(task.dueDate).toISOString().split('T')[0],
  //       reminderAt: new Date(task.reminderAt).toISOString().split('T')[0],
  //       assignedTo: task.assignedTo._id
  //     });
  //   } catch (error) {
  //     toast.error('Failed to fetch task');
  //     navigate('/tasks');
  //   }
  // }, [id, navigate]);

  useEffect(() => {
    if(user?.role == 'manager' || user?.role == 'admin'){

      fetchUsers();
    }
    if (id) {
      fetchTask();
    }
  }, [id, fetchTask]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(getApiUrl('/users/available'), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, status, priority, dueDate, reminderAt, assignedTo } = formData;

    if (!title || !description || !status || !priority || !dueDate || !reminderAt || !assignedTo) {
      toast.warn('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      if (id) {
        await axios.put(getApiUrl(`/tasks/${id}`), formData);
        toast.success('Task updated successfully');
      } else {
        await axios.post(getApiUrl('/tasks'), formData);
        toast.success('Task created successfully');
      }
      // navigate('/tasks');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100">
        <div className=" bg-white shadow-lg rounded-xl p-4">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            {id ? 'Edit Task' : 'Create New Task'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                 disabled={user?.role === 'user'}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                 disabled={user?.role === 'user'}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  id="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority"  disabled={user?.role === 'user'} className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  name="priority"
                  id="priority"
                  value={formData.priority}
                  onChange={handleChange}
                   disabled={user?.role === 'user'}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  id="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                   disabled={user?.role === 'user'}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="reminderAt" className="block text-sm font-medium text-gray-700">
                  Reminder Date
                </label>
                <input
                  type="date"
                  name="reminderAt"
                  id="reminderAt"
                  value={formData.reminderAt}
                  onChange={handleChange}
                   disabled={user?.role === 'user'}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">
                Assign To
              </label>
              <select
                name="assignedTo"
                id="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                disabled={user?.role === 'user'}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select User</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-semibold rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? 'Saving...' : id ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
