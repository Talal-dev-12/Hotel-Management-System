import { Search, Plus, CheckCircle, Clock, AlertCircle, Wrench } from 'lucide-react';
import { useState } from 'react';

export default function Housekeeping() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'maintenance'>('tasks');

  const cleaningTasks = [
    { id: 1, room: '101', type: 'Deluxe', status: 'Pending', priority: 'High', assignedTo: 'Maria Garcia', time: '10:00 AM', notes: 'Deep cleaning required' },
    { id: 2, room: '205', type: 'Suite', status: 'In Progress', priority: 'Medium', assignedTo: 'John Wilson', time: '11:30 AM', notes: 'Standard cleaning' },
    { id: 3, room: '312', type: 'Standard', status: 'Completed', priority: 'Low', assignedTo: 'Sarah Lee', time: '09:15 AM', notes: 'Guest checked out' },
    { id: 4, room: '408', type: 'Premium', status: 'Pending', priority: 'High', assignedTo: 'Maria Garcia', time: '02:00 PM', notes: 'VIP guest arriving' },
  ];

  const maintenanceRequests = [
    { id: 1, room: '203', issue: 'AC not working', priority: 'High', status: 'In Progress', reportedBy: 'Front Desk', assignedTo: 'Tech Team', time: '08:30 AM' },
    { id: 2, room: '506', issue: 'Leaking faucet', priority: 'Medium', status: 'Pending', reportedBy: 'Housekeeping', assignedTo: 'Plumber', time: '10:45 AM' },
    { id: 3, room: '410', issue: 'Broken TV remote', priority: 'Low', status: 'Completed', reportedBy: 'Guest', assignedTo: 'Tech Team', time: '09:00 AM' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-700';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      case 'Pending':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-amber-100 text-amber-700';
      case 'Low':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="text-emerald-600" size={20} />;
      case 'In Progress':
        return <Clock className="text-blue-600" size={20} />;
      case 'Pending':
        return <AlertCircle className="text-amber-600" size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Housekeeping & Maintenance</h1>
          <p className="text-gray-600 mt-1">Manage cleaning tasks and maintenance requests</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all shadow-lg">
          <Plus size={20} />
          New Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="text-amber-600" size={20} />
            </div>
            <span className="text-sm text-gray-600">Pending Tasks</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">24</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="text-blue-600" size={20} />
            </div>
            <span className="text-sm text-gray-600">In Progress</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">12</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CheckCircle className="text-emerald-600" size={20} />
            </div>
            <span className="text-sm text-gray-600">Completed Today</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">45</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <Wrench className="text-red-600" size={20} />
            </div>
            <span className="text-sm text-gray-600">Maintenance</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">8</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'tasks'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Cleaning Tasks
            </button>
            <button
              onClick={() => setActiveTab('maintenance')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'maintenance'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Maintenance Requests
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {activeTab === 'tasks' ? (
            <div className="space-y-4">
              {cleaningTasks.map((task) => (
                <div key={task.id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-lg">
                        {getStatusIcon(task.status)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">Room #{task.room}</h3>
                        <p className="text-sm text-gray-600">{task.type}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority} Priority
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Assigned To</p>
                      <p className="font-medium text-gray-900">{task.assignedTo}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Scheduled Time</p>
                      <p className="font-medium text-gray-900">{task.time}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Notes</p>
                      <p className="font-medium text-gray-900">{task.notes}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    {task.status === 'Pending' && (
                      <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Start Task
                      </button>
                    )}
                    {task.status === 'In Progress' && (
                      <button className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                        Mark Complete
                      </button>
                    )}
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {maintenanceRequests.map((request) => (
                <div key={request.id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-br from-red-100 to-orange-100 rounded-lg">
                        <Wrench className="text-red-600" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">Room #{request.room}</h3>
                        <p className="text-sm text-gray-600">{request.issue}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                        {request.priority} Priority
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Reported By</p>
                      <p className="font-medium text-gray-900">{request.reportedBy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Assigned To</p>
                      <p className="font-medium text-gray-900">{request.assignedTo}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Reported Time</p>
                      <p className="font-medium text-gray-900">{request.time}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    {request.status !== 'Completed' && (
                      <button className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all">
                        Update Status
                      </button>
                    )}
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
