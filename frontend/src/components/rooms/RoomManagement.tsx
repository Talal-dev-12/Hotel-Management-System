import { Plus, Search, Filter, BedDouble, Users, Wifi, Coffee, Tv, Wind } from 'lucide-react';
import { useState } from 'react';

export default function RoomManagement() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const rooms = [
    { id: 101, type: 'Deluxe', price: 250, status: 'Available', floor: 1, beds: 1, capacity: 2, amenities: ['Wifi', 'TV', 'AC', 'Coffee'] },
    { id: 102, type: 'Suite', price: 450, status: 'Occupied', floor: 1, beds: 2, capacity: 4, amenities: ['Wifi', 'TV', 'AC', 'Coffee'] },
    { id: 201, type: 'Standard', price: 150, status: 'Available', floor: 2, beds: 1, capacity: 2, amenities: ['Wifi', 'TV', 'AC'] },
    { id: 202, type: 'Premium', price: 350, status: 'Cleaning', floor: 2, beds: 2, capacity: 3, amenities: ['Wifi', 'TV', 'AC', 'Coffee'] },
    { id: 301, type: 'Deluxe', price: 250, status: 'Maintenance', floor: 3, beds: 1, capacity: 2, amenities: ['Wifi', 'TV', 'AC'] },
    { id: 302, type: 'Suite', price: 450, status: 'Available', floor: 3, beds: 2, capacity: 4, amenities: ['Wifi', 'TV', 'AC', 'Coffee'] },
    { id: 401, type: 'Premium', price: 350, status: 'Occupied', floor: 4, beds: 2, capacity: 3, amenities: ['Wifi', 'TV', 'AC', 'Coffee'] },
    { id: 402, type: 'Standard', price: 150, status: 'Available', floor: 4, beds: 1, capacity: 2, amenities: ['Wifi', 'TV'] },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'Occupied':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'Cleaning':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'Maintenance':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getIconForAmenity = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi size={16} />;
      case 'tv':
        return <Tv size={16} />;
      case 'ac':
        return <Wind size={16} />;
      case 'coffee':
        return <Coffee size={16} />;
      default:
        return null;
    }
  };

  const filteredRooms = filterStatus === 'all' ? rooms : rooms.filter(room => room.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Room Management</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all hotel rooms</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all shadow-lg"
        >
          <Plus size={20} />
          Add Room
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search rooms..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Status</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option>All Types</option>
            <option>Deluxe</option>
            <option>Suite</option>
            <option>Standard</option>
            <option>Premium</option>
          </select>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Room Cards */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map((room) => (
            <div key={room.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all overflow-hidden">
              <div className={`h-2 ${
                room.status === 'Available' ? 'bg-emerald-500' :
                room.status === 'Occupied' ? 'bg-red-500' :
                room.status === 'Cleaning' ? 'bg-amber-500' :
                'bg-purple-500'
              }`}></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">#{room.id}</h3>
                    <p className="text-sm text-gray-600">{room.type}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(room.status)}`}>
                    {room.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Floor:</span>
                    <span className="font-medium text-gray-900">{room.floor}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <BedDouble size={16} />
                      <span>Beds:</span>
                    </div>
                    <span className="font-medium text-gray-900">{room.beds}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users size={16} />
                      <span>Capacity:</span>
                    </div>
                    <span className="font-medium text-gray-900">{room.capacity} guests</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600 mb-2">Amenities:</p>
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                          {getIconForAmenity(amenity)}
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Price per night:</span>
                    <span className="text-2xl font-bold text-emerald-600">${room.price}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
                      Edit
                    </button>
                    <button className="flex-1 px-3 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 text-sm font-medium transition-all">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Room #</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Type</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Floor</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Capacity</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Price</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map((room) => (
                <tr key={room.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-semibold text-gray-900">#{room.id}</td>
                  <td className="py-4 px-6 text-gray-700">{room.type}</td>
                  <td className="py-4 px-6 text-gray-700">{room.floor}</td>
                  <td className="py-4 px-6 text-gray-700">{room.capacity} guests</td>
                  <td className="py-4 px-6 font-semibold text-emerald-600">${room.price}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(room.status)}`}>
                      {room.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
                        Edit
                      </button>
                      <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Room Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Add New Room</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
                  <input type="text" placeholder="101" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>Deluxe</option>
                    <option>Suite</option>
                    <option>Standard</option>
                    <option>Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Floor</label>
                  <input type="number" placeholder="1" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per Night ($)</label>
                  <input type="number" placeholder="250" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Beds</label>
                  <input type="number" placeholder="1" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                  <input type="number" placeholder="2" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Wifi', 'TV', 'AC', 'Coffee', 'Mini Bar', 'Safe'].map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
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
                Add Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
