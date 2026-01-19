import { Search, UserCheck, LogOut, CreditCard, Key } from 'lucide-react';
import { useState } from 'react';

export default function CheckInOut() {
  const [activeTab, setActiveTab] = useState<'checkin' | 'checkout'>('checkin');
  const [selectedGuest, setSelectedGuest] = useState<any>(null);

  const pendingCheckIns = [
    { id: 'BK-2001', guest: 'John Smith', room: '305', type: 'Deluxe', checkIn: '2026-01-20', checkOut: '2026-01-25', guests: 2, amount: 1250 },
    { id: 'BK-2002', guest: 'Emma Wilson', room: '412', type: 'Suite', checkIn: '2026-01-21', checkOut: '2026-01-24', guests: 4, amount: 1350 },
  ];

  const activeCheckOuts = [
    { id: 'BK-1998', guest: 'Michael Brown', room: '208', type: 'Standard', checkIn: '2026-01-17', checkOut: '2026-01-20', guests: 2, roomCharges: 450, services: 120, total: 570 },
    { id: 'BK-1999', guest: 'Sarah Davis', room: '501', type: 'Premium', checkIn: '2026-01-16', checkOut: '2026-01-20', guests: 3, roomCharges: 1400, services: 250, total: 1650 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Check-In / Check-Out</h1>
        <p className="text-gray-600 mt-1">Process guest arrivals and departures</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('checkin')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'checkin'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserCheck size={20} />
              Check-In
            </button>
            <button
              onClick={() => setActiveTab('checkout')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'checkout'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LogOut size={20} />
              Check-Out
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'checkin' ? (
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by booking ID or guest name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-4">
                {pendingCheckIns.map((booking) => (
                  <div key={booking.id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {booking.guest.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{booking.guest}</h3>
                          <p className="text-sm text-gray-600">Booking ID: {booking.id}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                        Pending Check-In
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Room</p>
                        <p className="font-semibold text-gray-900">#{booking.room}</p>
                        <p className="text-sm text-gray-600">{booking.type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Check-In</p>
                        <p className="font-semibold text-gray-900">{booking.checkIn}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Check-Out</p>
                        <p className="font-semibold text-gray-900">{booking.checkOut}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Guests</p>
                        <p className="font-semibold text-gray-900">{booking.guests} Guests</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Amount</span>
                        <span className="text-2xl font-bold text-emerald-600">${booking.amount}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedGuest(booking)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all shadow-lg font-medium"
                      >
                        <UserCheck size={20} />
                        Process Check-In
                      </button>
                      <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by room number or guest name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-4">
                {activeCheckOuts.map((booking) => (
                  <div key={booking.id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {booking.guest.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{booking.guest}</h3>
                          <p className="text-sm text-gray-600">Room #{booking.room} • {booking.type}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        Currently Staying
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Check-In Date</p>
                        <p className="font-semibold text-gray-900">{booking.checkIn}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Check-Out Date</p>
                        <p className="font-semibold text-gray-900">{booking.checkOut}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Number of Guests</p>
                        <p className="font-semibold text-gray-900">{booking.guests} Guests</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Billing Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Room Charges</span>
                          <span className="font-medium text-gray-900">${booking.roomCharges}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Additional Services</span>
                          <span className="font-medium text-gray-900">${booking.services}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                          <span className="font-semibold text-gray-900">Total Amount</span>
                          <span className="font-bold text-emerald-600 text-lg">${booking.total}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all shadow-lg font-medium">
                        <LogOut size={20} />
                        Process Check-Out
                      </button>
                      <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <CreditCard size={20} />
                        View Invoice
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Check-In Modal */}
      {selectedGuest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Complete Check-In</h2>
              <p className="text-gray-600 mt-1">{selectedGuest.guest} - Room #{selectedGuest.room}</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Key className="text-emerald-600" size={24} />
                  <h3 className="font-semibold text-gray-900">Room Assignment</h3>
                </div>
                <p className="text-sm text-gray-700">Room #{selectedGuest.room} is ready and cleaned</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Verify Guest Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ID/Passport Verified</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option>Yes - Verified</option>
                      <option>No - Not Verified</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option>Credit Card</option>
                      <option>Cash</option>
                      <option>Debit Card</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                <textarea
                  rows={3}
                  placeholder="Any special notes or requests..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Check-In Summary</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700">Room: #{selectedGuest.room} ({selectedGuest.type})</p>
                  <p className="text-gray-700">Duration: {selectedGuest.checkIn} to {selectedGuest.checkOut}</p>
                  <p className="text-gray-700">Guests: {selectedGuest.guests}</p>
                  <p className="font-semibold text-emerald-600 mt-2">Total: ${selectedGuest.amount}</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setSelectedGuest(null)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all shadow-lg">
                Confirm Check-In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
