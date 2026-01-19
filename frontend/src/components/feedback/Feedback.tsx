import { Star, Search, Plus, ThumbsUp, MessageSquare, Filter } from 'lucide-react';
import { useState } from 'react';

export default function Feedback() {
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'feedback' | 'services'>('feedback');

  const feedbackList = [
    { 
      id: 1, 
      guest: 'John Smith', 
      room: '305', 
      rating: 5, 
      date: '2026-01-18',
      comment: 'Excellent service! The staff was very friendly and helpful. Room was spotless and comfortable.',
      categories: { service: 5, cleanliness: 5, comfort: 5, facilities: 4 }
    },
    { 
      id: 2, 
      guest: 'Emma Wilson', 
      room: '412', 
      rating: 4, 
      date: '2026-01-17',
      comment: 'Great stay overall. The breakfast was amazing and the spa services were top-notch.',
      categories: { service: 4, cleanliness: 5, comfort: 4, facilities: 4 }
    },
    { 
      id: 3, 
      guest: 'Michael Brown', 
      room: '208', 
      rating: 5, 
      date: '2026-01-16',
      comment: 'Perfect location and beautiful rooms. Will definitely come back!',
      categories: { service: 5, cleanliness: 5, comfort: 5, facilities: 5 }
    },
    { 
      id: 4, 
      guest: 'Sarah Davis', 
      room: '501', 
      rating: 3, 
      date: '2026-01-15',
      comment: 'Good stay but AC had some issues. Management was quick to respond though.',
      categories: { service: 4, cleanliness: 4, comfort: 3, facilities: 3 }
    },
  ];

  const serviceRequests = [
    { id: 1, guest: 'Robert Johnson', room: '207', service: 'Room Service', item: 'Dinner for 2', status: 'Completed', time: '7:30 PM' },
    { id: 2, guest: 'Lisa Anderson', room: '310', service: 'Laundry', item: '3 pieces', status: 'In Progress', time: '2:00 PM' },
    { id: 3, guest: 'David Lee', room: '405', service: 'Spa Booking', item: 'Massage - 60 min', status: 'Pending', time: '4:00 PM' },
    { id: 4, guest: 'Maria Garcia', room: '102', service: 'Airport Transfer', item: 'Pickup at 8 AM', status: 'Scheduled', time: '8:00 AM' },
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            className={star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-700';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      case 'Pending':
        return 'bg-amber-100 text-amber-700';
      case 'Scheduled':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feedback & Services</h1>
          <p className="text-gray-600 mt-1">Guest reviews and service requests</p>
        </div>
        <button
          onClick={() => setShowServiceModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all shadow-lg"
        >
          <Plus size={20} />
          New Request
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Star className="text-amber-600" size={20} />
            </div>
            <span className="text-sm text-gray-600">Avg Rating</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">4.7</p>
          <p className="text-sm text-emerald-600 mt-1">+0.3 from last month</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="text-blue-600" size={20} />
            </div>
            <span className="text-sm text-gray-600">Total Reviews</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">1,248</p>
          <p className="text-sm text-gray-600 mt-1">This month: 156</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <ThumbsUp className="text-emerald-600" size={20} />
            </div>
            <span className="text-sm text-gray-600">Positive Reviews</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">94%</p>
          <p className="text-sm text-gray-600 mt-1">4+ stars</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MessageSquare className="text-purple-600" size={20} />
            </div>
            <span className="text-sm text-gray-600">Service Requests</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">342</p>
          <p className="text-sm text-gray-600 mt-1">This month</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('feedback')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'feedback'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Star size={20} />
              Guest Feedback
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'services'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare size={20} />
              Service Requests
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            {activeTab === 'feedback' && (
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>All Ratings</option>
                <option>5 Stars</option>
                <option>4 Stars</option>
                <option>3 Stars</option>
                <option>2 Stars</option>
                <option>1 Star</option>
              </select>
            )}
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={20} />
              Filters
            </button>
          </div>

          {activeTab === 'feedback' ? (
            <div className="space-y-4">
              {feedbackList.map((feedback) => (
                <div key={feedback.id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {feedback.guest.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{feedback.guest}</h3>
                        <p className="text-sm text-gray-600">Room #{feedback.room} • {feedback.date}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {renderStars(feedback.rating)}
                      <span className="text-sm font-semibold text-amber-600">{feedback.rating}.0 / 5.0</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">{feedback.comment}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 pt-4 border-t border-gray-200">
                    <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Service</p>
                      <div className="flex items-center justify-center gap-1">
                        {renderStars(feedback.categories.service)}
                      </div>
                    </div>
                    <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Cleanliness</p>
                      <div className="flex items-center justify-center gap-1">
                        {renderStars(feedback.categories.cleanliness)}
                      </div>
                    </div>
                    <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Comfort</p>
                      <div className="flex items-center justify-center gap-1">
                        {renderStars(feedback.categories.comfort)}
                      </div>
                    </div>
                    <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Facilities</p>
                      <div className="flex items-center justify-center gap-1">
                        {renderStars(feedback.categories.facilities)}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      Respond
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      View Full Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {serviceRequests.map((request) => (
                <div key={request.id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {request.guest.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{request.guest}</h3>
                        <p className="text-sm text-gray-600">Room #{request.room}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Service Type</p>
                      <p className="font-medium text-gray-900">{request.service}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Details</p>
                      <p className="font-medium text-gray-900">{request.item}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Scheduled Time</p>
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

      {/* Service Request Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">New Service Request</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guest Name</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>Room Service</option>
                    <option>Laundry</option>
                    <option>Spa Booking</option>
                    <option>Airport Transfer</option>
                    <option>Concierge</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Time</label>
                  <input type="time" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Request Details</label>
                <textarea
                  rows={4}
                  placeholder="Enter service details..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setShowServiceModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all shadow-lg">
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
