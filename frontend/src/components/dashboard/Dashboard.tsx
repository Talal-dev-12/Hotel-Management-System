import { useEffect, useState } from 'react';
import { Users, DoorOpen, Calendar, DollarSign, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import reportService from '../../services/reportService';
import reservationService from '../../services/reservationService';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch dashboard summary
      const summaryResponse = await reportService.getDashboardSummary();
      setDashboardData(summaryResponse.data);

      // Fetch recent bookings
      const bookingsResponse = await reservationService.getReservations({
        page: 1,
        limit: 5,
      });
      setRecentBookings(bookingsResponse.data || []);

    } catch (err: any) {
      console.error('Dashboard error:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts (you can replace with real API data later)
  const occupancyData = [
    { month: 'Jan', rate: 75 },
    { month: 'Feb', rate: 82 },
    { month: 'Mar', rate: 78 },
    { month: 'Apr', rate: 88 },
    { month: 'May', rate: 92 },
    { month: 'Jun', rate: dashboardData?.occupancy.rate || 85 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 125000 },
    { month: 'Feb', revenue: 145000 },
    { month: 'Mar', revenue: 135000 },
    { month: 'Apr', revenue: 165000 },
    { month: 'May', revenue: 185000 },
    { month: 'Jun', revenue: dashboardData?.monthRevenue || 195000 },
  ];

  const roomTypeData = [
    { name: 'Deluxe', value: 45, color: '#10b981' },
    { name: 'Suite', value: 30, color: '#3b82f6' },
    { name: 'Standard', value: 80, color: '#f59e0b' },
    { name: 'Premium', value: 25, color: '#8b5cf6' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="animate-spin text-emerald-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="text-red-600" size={24} />
          <h3 className="text-red-800 font-semibold">Error Loading Dashboard</h3>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const stats = [
    {
      title: "Today's Check-Ins",
      value: dashboardData?.todayCheckIns || 0,
      change: '+12%',
      trend: 'up',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: "Today's Check-Outs",
      value: dashboardData?.todayCheckOuts || 0,
      change: '-8%',
      trend: 'down',
      icon: Calendar,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Occupancy Rate',
      value: `${dashboardData?.occupancy.rate || 0}%`,
      change: '+15%',
      trend: 'up',
      icon: DoorOpen,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      subtitle: `${dashboardData?.occupancy.occupied}/${dashboardData?.occupancy.total} rooms`
    },
    {
      title: 'Monthly Revenue',
      value: `$${(dashboardData?.monthRevenue || 0).toLocaleString()}`,
      change: '+23%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-100 text-emerald-700';
      case 'Pending':
        return 'bg-amber-100 text-amber-700';
      case 'CheckedIn':
        return 'bg-blue-100 text-blue-700';
      case 'CheckedOut':
        return 'bg-gray-100 text-gray-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
        <p className="text-emerald-100">
          Here's what's happening with your hotel today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={stat.iconColor} size={24} />
                </div>
                <span className={`text-sm font-semibold ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              {stat.subtitle && (
                <p className="text-sm text-gray-600 mt-1">{stat.subtitle}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions - Role Based */}
      {user?.role !== 'Guest' && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors">
              <Calendar className="text-emerald-600" size={24} />
              <div className="text-left">
                <p className="font-medium text-gray-900">New Booking</p>
                <p className="text-sm text-gray-600">Create reservation</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <DoorOpen className="text-blue-600" size={24} />
              <div className="text-left">
                <p className="font-medium text-gray-900">Check-In Guest</p>
                <p className="text-sm text-gray-600">Process arrival</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
              <Users className="text-purple-600" size={24} />
              <div className="text-left">
                <p className="font-medium text-gray-900">Add Staff</p>
                <p className="text-sm text-gray-600">Create user account</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Occupancy Rate</h2>
            <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="rate" fill="url(#colorOccupancy)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Monthly Revenue</h2>
            <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h2>
          {recentBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Booking ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Guest</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Check-In</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {booking._id.substring(0, 8)}...
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {typeof booking.guestId === 'object' ? booking.guestId.name : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {new Date(booking.checkInDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.bookingStatus)}`}>
                          {booking.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="mx-auto mb-2 text-gray-400" size={48} />
              <p>No recent bookings</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Room Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={roomTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {roomTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {roomTypeData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Role-specific content */}
      {user?.role === 'Admin' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="text-blue-900 font-semibold mb-2">Admin Dashboard</h3>
              <p className="text-blue-700 text-sm">
                You have full access to all system features and reports. Pending tasks: {dashboardData?.pendingTasks || 0}
              </p>
            </div>
          </div>
        </div>
      )}

      {user?.role === 'Guest' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Users className="text-emerald-600" size={24} />
            </div>
            <div>
              <h3 className="text-emerald-900 font-semibold mb-2">Guest Portal</h3>
              <p className="text-emerald-700 text-sm">
                View your bookings, provide feedback, and manage your reservations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}