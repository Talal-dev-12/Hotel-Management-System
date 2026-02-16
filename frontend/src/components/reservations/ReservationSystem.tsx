import { Calendar, Search, Plus, Filter, Eye, Check, X, Loader2, AlertCircle } from 'lucide-react';
import { useReservation } from '../../hooks/useReservation';
import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import type { CreateReservationData, CheckAvailabilityData } from '../../types/reservation.types';
import type { Room } from '../../types/room.types';

interface BookingFormData {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestId: string;
  checkInDate: string;
  checkOutDate: string;
  roomType: string;
  roomId: string;
  numberOfGuests: { adults: number; children: number };
  totalAmount: number;
  advancePayment: number;
  specialRequests: string;
  bookingSource: 'Website' | 'Phone' | 'Walk-in' | 'Travel Agency' | 'OTA';
}

export default function ReservationSystem() {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Form state
  const [formData, setFormData] = useState<BookingFormData>({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    guestId: '',
    checkInDate: '',
    checkOutDate: '',
    roomType: '',
    roomId: '',
    numberOfGuests: { adults: 1, children: 0 },
    totalAmount: 0,
    advancePayment: 0,
    specialRequests: '',
    bookingSource: 'Website'
  });

  const {
    reservations,
    availableRooms,
    loading,
    error,
    createReservation,
    checkAvailability,
    cancelReservation,
    updateReservation,
    fetchReservations
  } = useReservation();

  // Fetch reservations on mount
  useEffect(() => {
    fetchReservations();
  }, []);

  // Filter bookings based on search and status
  const filteredBookings = reservations.filter(booking => {
    const guestName = typeof booking.guestId === 'object' 
      ? booking.guestId.name.toLowerCase() 
      : '';
    const bookingId = booking._id.toLowerCase();
    
    const matchesSearch = 
      guestName.includes(searchTerm.toLowerCase()) ||
      bookingId.includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.bookingStatus.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats from real data
  const stats = {
    total: reservations.length,
    confirmed: reservations.filter(r => r.bookingStatus === 'Confirmed').length,
    pending: reservations.filter(r => r.bookingStatus === 'Pending').length,
    cancelled: reservations.filter(r => r.bookingStatus === 'Cancelled').length
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'adultsCount') {
      setFormData(prev => ({
        ...prev,
        numberOfGuests: { ...prev.numberOfGuests, adults: parseInt(value) || 0 }
      }));
    } else if (name === 'childrenCount') {
      setFormData(prev => ({
        ...prev,
        numberOfGuests: { ...prev.numberOfGuests, children: parseInt(value) || 0 }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckAvailability = async () => {
    if (!formData.checkInDate || !formData.checkOutDate) {
      alert('Please select check-in and check-out dates');
      return;
    }

    try {
      const availabilityData: CheckAvailabilityData = {
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        roomType: formData.roomType || undefined
      };
      
      await checkAvailability(availabilityData);
    } catch (err) {
      console.error('Error checking availability:', err);
    }
  };

  const calculateTotalAmount = () => {
    if (!selectedRoom || !formData.checkInDate || !formData.checkOutDate) return 0;
    
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    return selectedRoom.price * nights;
  };

  const handleCreateBooking = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.guestName || !formData.guestEmail || !formData.checkInDate || 
        !formData.checkOutDate || !selectedRoom) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const totalAmount = calculateTotalAmount();
      
      const reservationData: CreateReservationData = {
        guestId: formData.guestId || 'new-guest', // Or create guest first
        roomId: selectedRoom._id,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        numberOfGuests: formData.numberOfGuests,
        totalAmount: totalAmount,
        advancePayment: formData.advancePayment || 0,
        specialRequests: formData.specialRequests || undefined,
        bookingSource: formData.bookingSource
      };

      await createReservation(reservationData);
      
      // Reset form
      setFormData({
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        guestId: '',
        checkInDate: '',
        checkOutDate: '',
        roomType: '',
        roomId: '',
        numberOfGuests: { adults: 1, children: 0 },
        totalAmount: 0,
        advancePayment: 0,
        specialRequests: '',
        bookingSource: 'Website'
      });
      setSelectedRoom(null);
      setShowBookingModal(false);
      alert('Booking created successfully!');
    } catch (err) {
      console.error('Error creating booking:', err);
      alert('Failed to create booking. Please try again.');
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await cancelReservation(bookingId, 'Cancelled by staff');
      alert('Booking cancelled successfully');
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Failed to cancel booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-100 text-emerald-800';
      case 'Pending':
        return 'bg-amber-100 text-amber-800';
      case 'CheckedIn':
        return 'bg-blue-100 text-blue-800';
      case 'CheckedOut':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reservation System</h1>
          <p className="text-gray-600 mt-1">Manage bookings and reservations</p>
        </div>
        <button
          onClick={() => setShowBookingModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all shadow-lg"
        >
          <Plus size={20} />
          New Booking
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-600" size={20} />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="text-blue-600" size={20} />
            </div>
            <span className="text-sm text-gray-600">Total Bookings</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Check className="text-emerald-600" size={20} />
            </div>
            <span className="text-sm text-gray-600">Confirmed</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.confirmed}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Calendar className="text-amber-600" size={20} />
            </div>
            <span className="text-sm text-gray-600">Pending</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <X className="text-red-600" size={20} />
            </div>
            <span className="text-sm text-gray-600">Cancelled</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.cancelled}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by guest name or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="CheckedIn">Checked In</option>
            <option value="CheckedOut">Checked Out</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={20} />
            More Filters
          </button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-emerald-600 mr-3" size={32} />
            <p className="text-gray-600">Loading reservations...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto text-gray-400 mb-3" size={48} />
            <p className="text-gray-600">No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Booking ID</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Guest Info</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Room</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Check-In</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Check-Out</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Guests</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Amount</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 font-semibold text-gray-900">{booking._id.substring(0, 8)}</td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">
                          {typeof booking.guestId === 'object' ? booking.guestId.name : 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {typeof booking.guestId === 'object' ? booking.guestId.email : 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {typeof booking.guestId === 'object' ? booking.guestId.phone : 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">
                          #{typeof booking.roomId === 'object' ? booking.roomId.roomNumber : booking.roomId}
                        </p>
                        <p className="text-sm text-gray-600">
                          {typeof booking.roomId === 'object' ? booking.roomId.roomType : 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {new Date(booking.checkInDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {new Date(booking.checkOutDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {booking.numberOfGuests.adults} Adult
                      {booking.numberOfGuests.children > 0 ? `, ${booking.numberOfGuests.children} Child` : ''}
                    </td>
                    <td className="py-4 px-6 font-semibold text-emerald-600">${booking.totalAmount}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.bookingStatus)}`}>
                        {booking.bookingStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button 
                          title="View Details"
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Eye size={18} className="text-gray-600" />
                        </button>
                        {(booking.bookingStatus === 'Confirmed' || booking.bookingStatus === 'Pending') && (
                          <button
                            title="Cancel Booking"
                            onClick={() => handleCancelBooking(booking._id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <X size={18} className="text-red-600" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">New Booking</h2>
              <p className="text-gray-600 mt-1">Create a new room reservation</p>
            </div>
            
            <form onSubmit={handleCreateBooking} className="p-6 space-y-6">
              {/* Guest Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input 
                      type="text" 
                      name="guestName"
                      value={formData.guestName}
                      onChange={handleInputChange}
                      required
                      placeholder="John Doe" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input 
                      type="email" 
                      name="guestEmail"
                      value={formData.guestEmail}
                      onChange={handleInputChange}
                      required
                      placeholder="john@email.com" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input 
                      type="tel" 
                      name="guestPhone"
                      value={formData.guestPhone}
                      onChange={handleInputChange}
                      required
                      placeholder="+1 234-567-8900" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Booking Source</label>
                    <select 
                      name="bookingSource"
                      value={formData.bookingSource}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Website">Website</option>
                      <option value="Phone">Phone</option>
                      <option value="Walk-in">Walk-in</option>
                      <option value="Travel Agency">Travel Agency</option>
                      <option value="OTA">OTA</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-In Date *</label>
                    <input 
                      type="date" 
                      name="checkInDate"
                      value={formData.checkInDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-Out Date *</label>
                    <input 
                      type="date" 
                      name="checkOutDate"
                      value={formData.checkOutDate}
                      onChange={handleInputChange}
                      required
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
                      <option value="">Select room type</option>
                      <option value="Standard">Standard</option>
                      <option value="Deluxe">Deluxe</option>
                      <option value="Premium">Premium</option>
                      <option value="Suite">Suite</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Adults *</label>
                    <input 
                      type="number" 
                      name="adultsCount"
                      value={formData.numberOfGuests.adults}
                      onChange={handleNumberInput}
                      min="1"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Children</label>
                    <input 
                      type="number" 
                      name="childrenCount"
                      value={formData.numberOfGuests.children}
                      onChange={handleNumberInput}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Advance Payment</label>
                    <input 
                      type="number" 
                      name="advancePayment"
                      value={formData.advancePayment}
                      onChange={handleNumberInput}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleCheckAvailability}
                    className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    Check Availability
                  </button>
                </div>

                {availableRooms.length > 0 && (
                  <div className="mt-4 p-4 border border-emerald-200 bg-emerald-50 rounded-lg">
                    <h4 className="font-semibold text-emerald-900 mb-2">Available Rooms</h4>
                    <div className="space-y-2">
                      {availableRooms.map(room => (
                        <label key={room._id} className="flex items-center gap-2 p-2 border border-emerald-200 rounded cursor-pointer hover:bg-white">
                          <input 
                            type="radio" 
                            name="roomId"
                            value={room._id}
                            checked={selectedRoom?._id === room._id}
                            onChange={() => setSelectedRoom(room)}
                            className="w-4 h-4"
                          />
                          <span className="flex-1">
                            {room.roomNumber} - {room.roomType} (${room.price}/night)
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Any special requests or preferences..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              {/* Price Summary */}
              {selectedRoom && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Booking Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Room Charges ({Math.ceil((new Date(formData.checkOutDate).getTime() - new Date(formData.checkInDate).getTime()) / (1000 * 60 * 60 * 24))} nights)
                      </span>
                      <span className="font-medium text-gray-900">${calculateTotalAmount().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Advance Payment</span>
                      <span className="font-medium text-gray-900">${formData.advancePayment.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between">
                      <span className="font-semibold text-gray-900">Total Amount</span>
                      <span className="font-bold text-emerald-600 text-lg">${calculateTotalAmount().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </form>

            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setShowBookingModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => document.querySelector('form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))}
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all shadow-lg"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}