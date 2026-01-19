import { Calendar, Search, Plus, Filter, Eye, Check, X } from 'lucide-react';
import { useState } from 'react';

export default function ReservationSystem() {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');

  const bookings = [
    { id: 'BK-2001', guest: 'John Smith', email: 'john@email.com', phone: '+1 234-567-8901', room: '305', type: 'Deluxe', checkIn: '2026-01-20', checkOut: '2026-01-25', guests: 2, amount: 1250, status: 'Confirmed' },
    { id: 'BK-2002', guest: 'Emma Wilson', email: 'emma@email.com', phone: '+1 234-567-8902', room: '412', type: 'Suite', checkIn: '2026-01-21', checkOut: '2026-01-24', guests: 4, amount: 1350, status: 'Pending' },
    { id: 'BK-2003', guest: 'Michael Brown', email: 'michael@email.com', phone: '+1 234-567-8903', room: '208', type: 'Standard', checkIn: '2026-01-19', checkOut: '2026-01-22', guests: 2, amount: 450, status: 'Checked In' },
    { id: 'BK-2004', guest: 'Sarah Davis', email: 'sarah@email.com', phone: '+1 234-567-8904', room: '501', type: 'Premium', checkIn: '2026-01-22', checkOut: '2026-01-27', guests: 3, amount: 1750, status: 'Confirmed' },
    { id: 'BK-2005', guest: 'Robert Taylor', email: 'robert@email.com', phone: '+1 234-567-8905', room: '103', type: 'Standard', checkIn: '2026-01-15', checkOut: '2026-01-18', guests: 1, amount: 450, status: 'Completed' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-100 text-emerald-700';
      case 'Pending':
        return 'bg-amber-100 text-amber-700';
      case 'Checked In':
        return 'bg-blue-100 text-blue-700';
      case 'Completed':
        return 'bg-gray-100 text-gray-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="text-blue-600" size={20} />
            </div>
            <span className="text-sm text-gray-600">Total Bookings</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">156</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Check className="text-emerald-600" size={20} />
            </div>
            <span className="text-sm text-gray-600">Confirmed</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">98</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Calendar className="text-amber-600" size={20} />
            </div>
            <span className="text-sm text-gray-600">Pending</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">42</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <X className="text-red-600" size={20} />
            </div>
            <span className="text-sm text-gray-600">Cancelled</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">16</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by guest name, booking ID, or room..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option>All Status</option>
            <option>Confirmed</option>
            <option>Pending</option>
            <option>Checked In</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={20} />
            More Filters
          </button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
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
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-semibold text-gray-900">{booking.id}</td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{booking.guest}</p>
                      <p className="text-sm text-gray-600">{booking.email}</p>
                      <p className="text-sm text-gray-600">{booking.phone}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">#{booking.room}</p>
                      <p className="text-sm text-gray-600">{booking.type}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-700">{booking.checkIn}</td>
                  <td className="py-4 px-6 text-gray-700">{booking.checkOut}</td>
                  <td className="py-4 px-6 text-gray-700">{booking.guests}</td>
                  <td className="py-4 px-6 font-semibold text-emerald-600">${booking.amount}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View Details">
                      <Eye size={18} className="text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">New Booking</h2>
              <p className="text-gray-600 mt-1">Create a new room reservation</p>
            </div>
            <div className="p-6 space-y-6">
              {/* Guest Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input type="text" placeholder="John Doe" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input type="email" placeholder="john@email.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input type="tel" placeholder="+1 234-567-8900" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ID/Passport Number</label>
                    <input type="text" placeholder="ABC123456" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-In Date *</label>
                    <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-Out Date *</label>
                    <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Type *</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option>Select room type</option>
                      <option>Standard - $150/night</option>
                      <option>Deluxe - $250/night</option>
                      <option>Premium - $350/night</option>
                      <option>Suite - $450/night</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests *</label>
                    <input type="number" min="1" placeholder="2" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>
              </div>

              {/* Additional Services */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Services (Optional)</h3>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
                    <span className="text-sm text-gray-700">Airport Pickup (+$50)</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
                    <span className="text-sm text-gray-700">Breakfast (+$25/day)</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
                    <span className="text-sm text-gray-700">Spa Services (+$100)</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
                    <span className="text-sm text-gray-700">Late Checkout (+$30)</span>
                  </label>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                <textarea
                  rows={3}
                  placeholder="Any special requests or preferences..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              {/* Price Summary */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room Charges (5 nights)</span>
                    <span className="font-medium text-gray-900">$1,250.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Additional Services</span>
                    <span className="font-medium text-gray-900">$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-medium text-gray-900">$125.00</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between">
                    <span className="font-semibold text-gray-900">Total Amount</span>
                    <span className="font-bold text-emerald-600 text-lg">$1,375.00</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setShowBookingModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all shadow-lg">
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
