import { Plus, Search, Filter, BedDouble, Users, Wifi, Coffee, Tv, Wind, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRoom } from '../../hooks/useRoom';
import type { Room, CreateRoomData } from '../../types/room.types';

interface RoomFormData {
  roomNumber: string;
  roomType: 'Single' | 'Double' | 'Suite' | 'Deluxe' | 'Presidential';
  floor: number;
  price: number;
  capacity: {
    adults: number;
    children: number;
  };
  bedType: 'Single' | 'Double' | 'Queen' | 'King';
  size: number;
  amenities: string[];
  description: string;
}

export default function RoomManagement() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const {
    rooms,
    loading,
    error,
    fetchRooms,
    createRoom,
    updateRoom,
    updateRoomStatus,
    deleteRoom
  } = useRoom();

  // Form state
  const [formData, setFormData] = useState<RoomFormData>({
    roomNumber: '',
    roomType: 'Single',
    floor: 1,
    price: 150,
    capacity: {
      adults: 2,
      children: 0
    },
    bedType: 'Single',
    size: 250,
    amenities: [],
    description: ''
  });

  // Fetch rooms on mount
  useEffect(() => {
    fetchRooms();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      if (name === 'capacityAdults' || name === 'capacityChildren') {
        const capacityKey = name === 'capacityAdults' ? 'adults' : 'children';
        setFormData(prev => ({
          ...prev,
          capacity: {
            ...prev.capacity,
            [capacityKey]: parseInt(value) || 0
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: parseInt(value) || 0
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleCreateRoom = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.roomNumber || !formData.roomType) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const roomData: CreateRoomData = {
        roomNumber: formData.roomNumber,
        roomType: formData.roomType,
        floor: formData.floor,
        price: formData.price,
        capacity: formData.capacity,
        bedType: formData.bedType,
        size: formData.size,
        amenities: formData.amenities.length > 0 ? formData.amenities : undefined,
        description: formData.description || undefined
      };

      await createRoom(roomData);

      // Reset form
      setFormData({
        roomNumber: '',
        roomType: 'Single',
        floor: 1,
        price: 150,
        capacity: {
          adults: 2,
          children: 0
        },
        bedType: 'Single',
        size: 250,
        amenities: [],
        description: ''
      });

      setShowAddModal(false);
      alert('Room created successfully!');
    } catch (err) {
      console.error('Error creating room:', err);
      alert('Failed to create room');
    }
  };

  const handleStatusChange = async (roomId: string, newStatus: string) => {
    try {
      await updateRoomStatus(roomId, newStatus);
      alert('Room status updated');
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!window.confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      await deleteRoom(roomId);
      alert('Room deleted successfully');
    } catch (err) {
      console.error('Error deleting room:', err);
      alert('Failed to delete room');
    }
  };

  // Filter rooms based on search and filters
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
    const matchesType = filterType === 'all' || room.roomType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Count stats
  const stats = {
    total: rooms.length,
    available: rooms.filter(r => r.status === 'Available').length,
    occupied: rooms.filter(r => r.status === 'Occupied').length,
    maintenance: rooms.filter(r => r.status === 'Maintenance').length
  };

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

  if (loading && rooms.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-emerald-600 mr-3" size={48} />
        <p className="text-gray-600">Loading rooms...</p>
      </div>
    );
  }

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

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-600" size={20} />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">Total Rooms</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">Available</p>
          <p className="text-3xl font-bold text-emerald-600">{stats.available}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">Occupied</p>
          <p className="text-3xl font-bold text-red-600">{stats.occupied}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">Maintenance</p>
          <p className="text-3xl font-bold text-purple-600">{stats.maintenance}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Types</option>
            <option value="Standard">Standard</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Premium">Premium</option>
            <option value="Suite">Suite</option>
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
      {filteredRooms.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-600">No rooms found</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map((room: Room) => (
            <div key={room._id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all overflow-hidden">
              <div className={`h-2 ${
                room.status === 'Available' ? 'bg-emerald-500' :
                room.status === 'Occupied' ? 'bg-red-500' :
                room.status === 'Cleaning' ? 'bg-amber-500' :
                'bg-purple-500'
              }`}></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">#{room.roomNumber}</h3>
                    <p className="text-sm text-gray-600">{room.roomType}</p>
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
                      <Users size={16} />
                      <span>Capacity:</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {room.capacity.adults} adult{room.capacity.adults !== 1 ? 's' : ''}
                      {room.capacity.children > 0 && `, ${room.capacity.children} child${room.capacity.children !== 1 ? 'ren' : ''}`}
                    </span>
                  </div>
                  {room.amenities && room.amenities.length > 0 && (
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
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Price per night:</span>
                    <span className="text-2xl font-bold text-emerald-600">${room.price}</span>
                  </div>
                  <div className="flex gap-2 flex-col text-xs">
                    <select
                      value={room.status}
                      onChange={(e) => handleStatusChange(room._id, e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Available">Available</option>
                      <option value="Occupied">Occupied</option>
                      <option value="Cleaning">Cleaning</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteRoom(room._id)}
                        className="flex-1 px-2 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors text-xs"
                      >
                        Delete
                      </button>
                    </div>
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
              {filteredRooms.map((room: Room) => (
                <tr key={room._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-semibold text-gray-900">#{room.roomNumber}</td>
                  <td className="py-4 px-6 text-gray-700">{room.roomType}</td>
                  <td className="py-4 px-6 text-gray-700">{room.floor}</td>
                  <td className="py-4 px-6 text-gray-700">
                    {room.capacity.adults} adult{room.capacity.adults !== 1 ? 's' : ''}
                    {room.capacity.children > 0 && `, ${room.capacity.children} child${room.capacity.children !== 1 ? 'ren' : ''}`}
                  </td>
                  <td className="py-4 px-6 font-semibold text-emerald-600">${room.price}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(room.status)}`}>
                      {room.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <select
                        value={room.status}
                        onChange={(e) => handleStatusChange(room._id, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Available">Available</option>
                        <option value="Occupied">Occupied</option>
                        <option value="Cleaning">Cleaning</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                      <button
                        onClick={() => handleDeleteRoom(room._id)}
                        className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs border border-red-300 transition-colors"
                      >
                        Delete
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
            <form onSubmit={handleCreateRoom} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Number *</label>
                  <input
                    type="text"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleInputChange}
                    required
                    placeholder="101"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Type *</label>
                  <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Suite">Suite</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Presidential">Presidential</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bed Type *</label>
                  <select
                    name="bedType"
                    value={formData.bedType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Queen">Queen</option>
                    <option value="King">King</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Size (sqft) *</label>
                  <input
                    type="number"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    required
                    min="1"
                    placeholder="250"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Floor *</label>
                  <input
                    type="number"
                    name="floor"
                    value={formData.floor}
                    onChange={handleInputChange}
                    required
                    min="1"
                    placeholder="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per Night ($) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="1"
                    placeholder="250"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adults Capacity *</label>
                  <input
                    type="number"
                    name="capacityAdults"
                    value={formData.capacity.adults}
                    onChange={handleInputChange}
                    required
                    min="1"
                    placeholder="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Children Capacity</label>
                  <input
                    type="number"
                    name="capacityChildren"
                    value={formData.capacity.children}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Room description..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Wifi', 'TV', 'AC', 'Coffee', 'Mini Bar', 'Safe'].map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </form>
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => document.querySelector('form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all shadow-lg"
              >
                Add Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}