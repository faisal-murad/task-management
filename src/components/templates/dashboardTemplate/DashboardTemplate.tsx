"use client";

import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import {
  CheckCircle2,
  Circle,
  User,
  Calendar,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Clock,
  AlertTriangle,
  X,
  Users,
  Zap,
  Target,
  TrendingUp,
  ArrowRight,
  UserCheck,
  UserPlus
} from 'lucide-react';
import CreateTask from '@/components/molecules/CreateTaskModal';
import { ITask, NewTaskForm } from '@/types';
import api from '@/lib/axiosInstance';
import { IUser } from '@/lib/models/User';
import { TaskCard } from '@/components/organisms/TaskCard';
  // Mark as complete handler
// Types
interface User {
  name: string;
  email: string;
  avatar: string;
}


// Mock current user - you would get this from your auth context
const currentUser = { name: "John Smith", email: "john@company.com", avatar: "JS" };
 
const StatsCard = ({ title, value, icon: Icon, gradient, trend, onClick, isActive }: {
  title: string;
  value: number;
  icon: any;
  gradient: string;
  trend?: string;
  onClick?: () => void;
  isActive?: boolean;
}) => (
  <div 
    className={`${gradient} rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-200 relative overflow-hidden group ${
      onClick ? 'cursor-pointer transform hover:scale-105' : ''
    } ${isActive ? 'ring-2 ring-white ring-opacity-50' : ''}`}
    onClick={onClick}
  >
    <div className="absolute top-0 right-0 w-16 h-16 opacity-10 transform translate-x-4 -translate-y-4">
      <Icon className="w-full h-full" />
    </div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
          <Icon className="w-4 h-4 text-white" />
        </div>
        {trend && <span className="text-xs opacity-75">{trend}</span>}
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider opacity-80 mb-1">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);


// Main Component
export default function DashboardTemplate() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // e.g., 'all', 'pending', 'completed'
  const [taskType, setTaskType] = useState<"all" | "created" | "assigned">("all");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  
  const [completingTaskId, setCompletingTaskId] = useState<string | number | null>(null);
  const handleMarkComplete = async (task: ITask) => {
    setCompletingTaskId(task._id);
    try {
      const res = await api.put(`/task/complete`, { taskId: task._id });
      if (res.data) {
        await fetchTasks();
      } else {
        console.error('Failed to mark as complete:', res.data);
      }
    } catch (error) {
      console.error('Error marking as complete:', error);
    } finally {
      setCompletingTaskId(null);
    }
  };

  // Fetch tasks based on filters
  const fetchTasks = async (
    type: any = filterStatus,
    search: string = searchTerm
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("type", type);
      if (search) params.append("search", search);
      console.log("🚀 ~ fetchTasks ~ params:", params.toString())
      const response = await api(`/task?${params}`);
      if (response?.data) {
        setTasks(response?.data?.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };


   // Load tasks and users on component mount
  useEffect(() => {
    fetchTasks();
    const fetchUsers = async () => {
      setUsersLoading(true);
      try {
        const res = await api.get('/users');
        console.log("🚀 ~ fetchUsers ~ res:", res?.data)
        
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setUsers([]);
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, []);
 
  // Handle status filter change
  const handleStatusFilter = (type: "all" | "created" | "assigned") => {
    setFilterStatus(type);
    setTaskType(type);
    fetchTasks(type, searchTerm);
  };

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchTasks(taskType, term);
  };

  const [creatingTask, setCreatingTask] = useState(false);
  const handleNewTask = async (newTaskData: NewTaskForm) => {
    console.log("🚀 ~ handleNewTask ~ newTaskData:", newTaskData);
    setCreatingTask(true);
    try {
      const res = await api.post('/task', newTaskData);
      if (res.data && (res.data.success || res.status === 201 || res.status === 200)) {
        fetchTasks();
      } else {
        // Optionally show error to user
        console.error('Failed to create task:', res.data);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      // Optionally show error to user
    } finally {
      setCreatingTask(false);
    }
  };
 
  // No local filtering; tasks are always from API
  const filteredTasks = tasks;
 
 

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Dashboard</h1>
            <p className="text-gray-600">Manage and track your team's tasks</p>
          </div>
 
          {/* Controls Section */}
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6 border border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all w-full bg-white text-gray-900 placeholder-gray-500 text-sm"
                  />
                </div>

                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => handleStatusFilter(e.target.value as "all" | "created" | "assigned")}
                    className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white text-gray-900 min-w-[160px] text-sm"
                  >
                    <option value="all">All</option>
                    <option value="created">Created by me</option>
                    <option value="assigned">Assigned to me</option> 
                  </select>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm text-sm"
              >
                <Plus className="w-4 h-4" />
                New Task
              </button>
            </div>
          </div>

          {/* Tasks Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Tasks ({filteredTasks.length})
              </h2>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <div className="text-gray-500 text-lg font-medium">Loading tasks...</div>
              </div>
            ) : filteredTasks.length > 0 ? (
              <div>
                {filteredTasks.map((task) => (
                  <TaskCard key={task._id} task={task} onMarkComplete={handleMarkComplete} loading={completingTaskId === task._id} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-200">
                <Circle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed mb-6">
                  {searchTerm || filterStatus !== 'all'
                    ? 'Try adjusting your search criteria or filters to find what you\'re looking for.'
                    : 'Get started by creating your first task to organize your team\'s workflow.'
                  }
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center gap-2 mx-auto shadow-sm text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Task
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Task Modal */}
      <CreateTask
        open={isModalOpen}
        setOpen={setIsModalOpen}
        onSubmit={handleNewTask}
        users={users}
        usersLoading={usersLoading}
        creatingTask={creatingTask}
      />
    </>
  );
}