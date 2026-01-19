import { Search, Plus, MoreVertical, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { useState } from 'react';

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState<'staff' | 'guests'>('staff');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const staffMembers = [
    { id: 1, name: 'John Anderson', role: 'Manager', email: 'john@luxurystay.com', status: 'Active', department: 'Operations', joinDate: '2024-01-15' },
    { id: 2, name: 'Sarah Williams', role: 'Receptionist', email: 'sarah@luxurystay.com', status: 'Active', department: 'Front Desk', joinDate: '2024-03-20' },
    { id: 3, name: 'Michael Chen', role: 'Housekeeping', email: 'michael@luxurystay.com', status: 'Active', department: 'Housekeeping', joinDate: '2023-11-10' },
    { id: 4, name: 'Emily Davis', role: 'Staff', email: 'emily@luxurystay.com', status: 'Inactive', department: 'Maintenance', joinDate: '2025-05-05' },
  ];

  const guests = [
    { id: 1, name: 'Robert Johnson', email: 'robert@email.com', phone: '+1 234-567-8901', visits: 15, lastVisit: '2026-01-10', status: 'VIP' },
    { id: 2, name: 'Jennifer Lee', email: 'jennifer@email.com', phone: '+1 234-567-8902', visits: 3, lastVisit: '2025-12-25', status: 'Regular' },
    { id: 3, name: 'David Martinez', email: 'david@email.com', phone: '+1 234-567-8903', visits: 8, lastVisit: '2026-01-15', status: 'Premium' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage staff members and guest profiles</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all shadow-lg"
        >
          <Plus size={20} />
          Add User
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('staff')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'staff'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Staff Members
            </button>
            <button
              onClick={() => setActiveTab('guests')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'guests'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Guest Profiles
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>All Departments</option>
              <option>Operations</option>
              <option>Front Desk</option>
              <option>Housekeeping</option>
              <option>Maintenance</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          {activeTab === 'staff' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Department</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Join Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffMembers.map((staff) => (
                    <tr key={staff.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {staff.name.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">{staff.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">{staff.role}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{staff.email}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{staff.department}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{staff.joinDate}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          staff.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {staff.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="relative">
                          <button
                            onClick={() => setActiveMenu(activeMenu === staff.id ? null : staff.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical size={18} className="text-gray-600" />
                          </button>
                          {activeMenu === staff.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left">
                                <Edit size={16} className="text-gray-600" />
                                <span className="text-sm text-gray-700">Edit</span>
                              </button>
                              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left">
                                <UserCheck size={16} className="text-gray-600" />
                                <span className="text-sm text-gray-700">Activate</span>
                              </button>
                              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-left">
                                <Trash2 size={16} className="text-red-600" />
                                <span className="text-sm text-red-600">Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guests.map((guest) => (
                <div key={guest.id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {guest.name.charAt(0)}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      guest.status === 'VIP' ? 'bg-purple-100 text-purple-700' :
                      guest.status === 'Premium' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {guest.status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{guest.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{guest.email}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Phone:</span>
                      <span className="text-gray-900">{guest.phone}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Visits:</span>
                      <span className="font-semibold text-emerald-600">{guest.visits}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Visit:</span>
                      <span className="text-gray-900">{guest.lastVisit}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                    <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
                      View Profile
                    </button>
                    <button className="flex-1 px-3 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 text-sm font-medium transition-all">
                      Book Room
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Add New User</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>Manager</option>
                    <option>Staff</option>
                    <option>Receptionist</option>
                    <option>Housekeeping</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>Operations</option>
                    <option>Front Desk</option>
                    <option>Housekeeping</option>
                    <option>Maintenance</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all shadow-lg">
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
