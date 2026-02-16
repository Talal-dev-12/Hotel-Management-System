import { Search, Plus, MoreVertical, Edit, Trash2, UserCheck } from 'lucide-react';
import { useState, useEffect, useMemo, ChangeEvent, FormEvent } from 'react';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  phone?: string;
  status: string;
  joinDate: string;
  password?: string;
}

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  visits: number;
  lastVisit: string;
}

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState<string>('staff');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All Departments');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  
  // Data states
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [editingUser, setEditingUser] = useState<StaffMember | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<StaffMember>({
    id: '',
    name: '',
    email: '',
    role: 'Staff',
    department: 'Operations',
    phone: '',
    status: 'Active',
    joinDate: '',
    password: ''
  });

  // Fetch staff members on mount
  useEffect(() => {
    fetchStaff();
    fetchGuests();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/staff');
      if (!response.ok) throw new Error('Failed to fetch staff');
      const data = await response.json();
      setStaffMembers(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching staff:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGuests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/guests');
      if (!response.ok) throw new Error('Failed to fetch guests');
      const data = await response.json();
      setGuests(data);
    } catch (err) {
      console.error('Error fetching guests:', err);
    }
  };

  // Filter staff based on search and filters
  const filteredStaff = useMemo(() => {
    return staffMembers.filter(staff => {
      const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           staff.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = departmentFilter === 'All Departments' || staff.department === departmentFilter;
      const matchesStatus = statusFilter === 'All Status' || staff.status === statusFilter;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [staffMembers, searchTerm, departmentFilter, statusFilter]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      email: '',
      role: 'Staff',
      department: 'Operations',
      phone: '',
      status: 'Active',
      joinDate: '',
      password: ''
    });
    setEditingUser(null);
  };

  const handleAddUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add user');
      }

      const newUser = await response.json();
      setStaffMembers([...staffMembers, newUser]);
      resetForm();
      setShowAddModal(false);
      alert('Staff member added successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      alert(`Error: ${errorMessage}`);
      console.error('Error adding staff:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: StaffMember) => {
    setEditingUser(user);
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      phone: user.phone || '',
      status: user.status,
      joinDate: user.joinDate,
      password: ''
    });
    setShowEditModal(true);
    setActiveMenu(null);
  };

  const handleUpdateUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !editingUser) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const updateData: Partial<StaffMember> = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        phone: formData.phone
      };
      
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch(`http://localhost:5000/api/staff/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      const updatedUser = await response.json();
      setStaffMembers(staffMembers.map(user =>
        user.id === editingUser.id ? updatedUser : user
      ));
      resetForm();
      setShowEditModal(false);
      alert('Staff member updated successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      alert(`Error: ${errorMessage}`);
      console.error('Error updating staff:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/staff/${userId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }

      setStaffMembers(staffMembers.filter(user => user.id !== userId));
      setActiveMenu(null);
      alert('Staff member deleted successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      alert(`Error: ${errorMessage}`);
      console.error('Error deleting staff:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId: string) => {
    const user = staffMembers.find(u => u.id === userId);
    if (!user) {
      alert('User not found');
      return;
    }
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/staff/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update status');
      }

      const updatedUser = await response.json();
      setStaffMembers(staffMembers.map(u =>
        u.id === userId ? updatedUser : u
      ));
      setActiveMenu(null);
      alert(`User ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully!`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      alert(`Error: ${errorMessage}`);
      console.error('Error updating status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookRoom = async (guestId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/guests/${guestId}/book-room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to book room');
      }

      const updatedGuest = await response.json();
      setGuests(guests.map(g =>
        g.id === guestId ? updatedGuest : g
      ));
      alert(`Room booked for ${updatedGuest.name}!`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      alert(`Error: ${errorMessage}`);
      console.error('Error booking room:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage staff members and guest profiles</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50"
        >
          <Plus size={20} />
          Add User
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      )}

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <select 
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option>All Departments</option>
              <option>Operations</option>
              <option>Front Desk</option>
              <option>Housekeeping</option>
              <option>Maintenance</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          {activeTab === 'staff' ? (
            <div className="overflow-x-auto">
              {loading && <p className="text-center text-gray-600">Loading...</p>}
              {filteredStaff.length === 0 && !loading ? (
                <p className="text-center text-gray-600 py-8">No staff members found</p>
              ) : (
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
                    {filteredStaff.map((staff) => (
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
                              disabled={loading}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                            >
                              <MoreVertical size={18} className="text-gray-600" />
                            </button>
                            {activeMenu === staff.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                                <button 
                                  onClick={() => handleEditUser(staff)}
                                  disabled={loading}
                                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left disabled:opacity-50"
                                >
                                  <Edit size={16} className="text-gray-600" />
                                  <span className="text-sm text-gray-700">Edit</span>
                                </button>
                                <button 
                                  onClick={() => handleToggleStatus(staff.id)}
                                  disabled={loading}
                                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left disabled:opacity-50"
                                >
                                  <UserCheck size={16} className="text-gray-600" />
                                  <span className="text-sm text-gray-700">
                                    {staff.status === 'Active' ? 'Deactivate' : 'Activate'}
                                  </span>
                                </button>
                                <button 
                                  onClick={() => handleDeleteUser(staff.id)}
                                  disabled={loading}
                                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-left disabled:opacity-50"
                                >
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
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guests.length === 0 && !loading ? (
                <p className="text-center text-gray-600 py-8">No guests found</p>
              ) : (
                guests.map((guest) => (
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
                      <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors disabled:opacity-50" disabled={loading}>
                        View Profile
                      </button>
                      <button 
                        onClick={() => handleBookRoom(guest.id)}
                        disabled={loading}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 text-sm font-medium transition-all disabled:opacity-50"
                      >
                        Book Room
                      </button>
                    </div>
                  </div>
                ))
              )}
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
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select 
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>Manager</option>
                    <option>Staff</option>
                    <option>Receptionist</option>
                    <option>Housekeeping</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select 
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>Operations</option>
                    <option>Front Desk</option>
                    <option>Housekeeping</option>
                    <option>Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Edit User</h2>
            </div>
            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password (Leave blank to keep current)</label>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select 
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>Manager</option>
                    <option>Staff</option>
                    <option>Receptionist</option>
                    <option>Housekeeping</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select 
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>Operations</option>
                    <option>Front Desk</option>
                    <option>Housekeeping</option>
                    <option>Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}