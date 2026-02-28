import { Search, UserCheck, LogOut, CreditCard, Key, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect, ChangeEvent } from 'react';
import { useReservation } from '../../hooks/useReservation';
import type { Reservation } from '../../types/reservation.types';

interface CheckInFormData {
  idVerified: string;
  paymentMethod: string;
  notes: string;
}

export default function CheckInOut() {
  const [activeTab, setActiveTab] = useState<'checkin' | 'checkout'>('checkin');
  const [selectedGuest, setSelectedGuest] = useState<Reservation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<CheckInFormData>({
    idVerified: 'Yes - Verified',
    paymentMethod: 'Credit Card',
    notes: ''
  });
  const [processingId, setProcessingId] = useState<string | null>(null);

  const {
    reservations,
    loading,
    error,
    fetchReservations,
    checkIn,
    checkOut
  } = useReservation();

  // Fetch reservations on mount
  useEffect(() => {
    fetchReservations();
  }, []);

  // Filter reservations by status
  const pendingCheckIns = reservations.filter(
    r => r.bookingStatus === 'Confirmed'  // ✅ Only Confirmed reservations can check-in
  );

  const activeCheckOuts = reservations.filter(
    r => r.bookingStatus === 'CheckedIn'
  );

  // Search filter
  const getFilteredCheckIns = () => {
    return pendingCheckIns.filter(booking => {
      const searchLower = searchTerm.toLowerCase();
      const bookingId = booking._id.toLowerCase();
      const guestName = typeof booking.guestId === 'object'
        ? booking.guestId.name.toLowerCase()
        : '';
      
      return bookingId.includes(searchLower) || guestName.includes(searchLower);
    });
  };

  const getFilteredCheckOuts = () => {
    return activeCheckOuts.filter(booking => {
      const searchLower = searchTerm.toLowerCase();
      const roomNumber = typeof booking.roomId === 'object'
        ? booking.roomId.roomNumber.toLowerCase()
        : '';
      const guestName = typeof booking.guestId === 'object'
        ? booking.guestId.name.toLowerCase()
        : '';
      
      return roomNumber.includes(searchLower) || guestName.includes(searchLower);
    });
  };

  const handleFormChange = (e: ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckIn = async () => {
    if (!selectedGuest) return;

    try {
      setProcessingId(selectedGuest._id);
      await checkIn(selectedGuest._id);
      setSelectedGuest(null);
      setFormData({
        idVerified: 'Yes - Verified',
        paymentMethod: 'Credit Card',
        notes: ''
      });
      alert('Check-in completed successfully!');
    } catch (err) {
      console.error('Error during check-in:', err);
      alert('Failed to complete check-in. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleCheckOut = async (reservationId: string) => {
    try {
      setProcessingId(reservationId);
      await checkOut(reservationId);
      alert('Check-out completed successfully!');
    } catch (err) {
      console.error('Error during check-out:', err);
      alert('Failed to complete check-out. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const getGuestName = (guestId: any) => {
    return typeof guestId === 'object' ? guestId.name : 'Unknown Guest';
  };

  const getGuestEmail = (guestId: any) => {
    return typeof guestId === 'object' ? guestId.email : 'N/A';
  };

  const getRoomNumber = (roomId: any) => {
    return typeof roomId === 'object' ? roomId.roomNumber : 'N/A';
  };

  const getRoomType = (roomId: any) => {
    return typeof roomId === 'object' ? roomId.roomType : 'N/A';
  };

  const getRoomPrice = (roomId: any) => {
    return typeof roomId === 'object' ? roomId.price : 0;
  };

  if (loading && reservations.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-emerald-600 mr-3" size={48} />
        <p className="text-gray-600">Loading reservations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Check-In / Check-Out</h1>
        <p className="text-gray-600 mt-1">Process guest arrivals and departures</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-600" size={20} />
          <p className="text-red-800">{error}</p>
        </div>
      )}

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
              Check-In ({pendingCheckIns.length})
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
              Check-Out ({activeCheckOuts.length})
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {getFilteredCheckIns().length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No pending check-ins</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getFilteredCheckIns().map((booking) => (
                    <div key={booking._id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {getGuestName(booking.guestId).charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{getGuestName(booking.guestId)}</h3>
                            <p className="text-sm text-gray-600">Booking ID: {booking._id.substring(0, 8)}</p>
                            <p className="text-sm text-gray-600">{getGuestEmail(booking.guestId)}</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                          {booking.bookingStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Room</p>
                          <p className="font-semibold text-gray-900">#{getRoomNumber(booking.roomId)}</p>
                          <p className="text-sm text-gray-600">{getRoomType(booking.roomId)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Check-In</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(booking.checkInDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Check-Out</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(booking.checkOutDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Guests</p>
                          <p className="font-semibold text-gray-900">
                            {booking.numberOfGuests.adults} Adult{booking.numberOfGuests.children > 0 ? `, ${booking.numberOfGuests.children} Child` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total Amount</span>
                          <span className="text-2xl font-bold text-emerald-600">${booking.totalAmount}</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setSelectedGuest(booking)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={processingId === booking._id}
                        >
                          <UserCheck size={20} />
                          {processingId === booking._id ? 'Processing...' : 'Process Check-In'}
                        </button>
                        <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by room number or guest name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {getFilteredCheckOuts().length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No active check-outs</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getFilteredCheckOuts().map((booking) => (
                    <div key={booking._id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {getGuestName(booking.guestId).charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{getGuestName(booking.guestId)}</h3>
                            <p className="text-sm text-gray-600">Room #{getRoomNumber(booking.roomId)} • {getRoomType(booking.roomId)}</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          Currently Staying
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Check-In Date</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(booking.checkInDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Check-Out Date</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(booking.checkOutDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Number of Guests</p>
                          <p className="font-semibold text-gray-900">
                            {booking.numberOfGuests.adults} Adult{booking.numberOfGuests.children > 0 ? `, ${booking.numberOfGuests.children} Child` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Billing Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Room Charges</span>
                            <span className="font-medium text-gray-900">
                              ${getRoomPrice(booking.roomId) * Math.ceil(
                                (new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 60 * 60 * 24)
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Additional Services</span>
                            <span className="font-medium text-gray-900">$0</span>
                          </div>
                          <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                            <span className="font-semibold text-gray-900">Total Amount</span>
                            <span className="font-bold text-emerald-600 text-lg">${booking.totalAmount}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleCheckOut(booking._id)}
                          disabled={processingId === booking._id}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <LogOut size={20} />
                          {processingId === booking._id ? 'Processing...' : 'Process Check-Out'}
                        </button>
                        <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <CreditCard size={20} />
                          View Invoice
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              <p className="text-gray-600 mt-1">{getGuestName(selectedGuest.guestId)} - Room #{getRoomNumber(selectedGuest.roomId)}</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Key className="text-emerald-600" size={24} />
                  <h3 className="font-semibold text-gray-900">Room Assignment</h3>
                </div>
                <p className="text-sm text-gray-700">Room #{getRoomNumber(selectedGuest.roomId)} ({getRoomType(selectedGuest.roomId)}) is ready and cleaned</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Verify Guest Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ID/Passport Verified</label>
                    <select
                      name="idVerified"
                      value={formData.idVerified}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option>Yes - Verified</option>
                      <option>No - Not Verified</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
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
                  name="notes"
                  value={formData.notes}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="Any special notes or requests..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Check-In Summary</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700">Guest: {getGuestName(selectedGuest.guestId)}</p>
                  <p className="text-gray-700">Room: #{getRoomNumber(selectedGuest.roomId)} ({getRoomType(selectedGuest.roomId)})</p>
                  <p className="text-gray-700">Check-In: {new Date(selectedGuest.checkInDate).toLocaleDateString()}</p>
                  <p className="text-gray-700">Check-Out: {new Date(selectedGuest.checkOutDate).toLocaleDateString()}</p>
                  <p className="text-gray-700">Guests: {selectedGuest.numberOfGuests.adults} Adult{selectedGuest.numberOfGuests.children > 0 ? `, ${selectedGuest.numberOfGuests.children} Child` : ''}</p>
                  <p className="font-semibold text-emerald-600 mt-2">Total: ${selectedGuest.totalAmount}</p>
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
              <button
                onClick={handleCheckIn}
                disabled={processingId === selectedGuest._id}
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processingId === selectedGuest._id ? 'Processing...' : 'Confirm Check-In'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}