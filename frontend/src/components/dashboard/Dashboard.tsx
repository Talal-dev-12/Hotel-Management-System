import { BedDouble, DoorOpen, DoorClosed, DollarSign, TrendingUp, Users, Calendar } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Rooms',
      value: '250',
      change: '+12%',
      trend: 'up',
      icon: BedDouble,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Available Rooms',
      value: '48',
      change: '-8%',
      trend: 'down',
      icon: DoorOpen,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      title: 'Occupied Rooms',
      value: '202',
      change: '+15%',
      trend: 'up',
      icon: DoorClosed,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600'
    },
    {
      title: "Today's Revenue",
      value: '$45,280',
      change: '+23%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
  ];

  const occupancyData = [
    { month: 'Jan', rate: 75 },
    { month: 'Feb', rate: 82 },
    { month: 'Mar', rate: 78 },
    { month: 'Apr', rate: 88 },
    { month: 'May', rate: 92 },
    { month: 'Jun', rate: 95 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 125000 },
    { month: 'Feb', revenue: 145000 },
    { month: 'Mar', revenue: 135000 },
    { month: 'Apr', revenue: 165000 },
    { month: 'May', revenue: 185000 },
    { month: 'Jun', revenue: 195000 },
  ];

  const roomTypeData = [
    { name: 'Deluxe', value: 45, color: '#10b981' },
    { name: 'Suite', value: 30, color: '#3b82f6' },
    { name: 'Standard', value: 80, color: '#f59e0b' },
    { name: 'Premium', value: 25, color: '#8b5cf6' },
  ];

  const recentBookings = [
    { id: 'BK-1234', guest: 'John Smith', room: '305', checkIn: '2026-01-20', status: 'Confirmed' },
    { id: 'BK-1235', guest: 'Emma Wilson', room: '412', checkIn: '2026-01-21', status: 'Pending' },
    { id: 'BK-1236', guest: 'Michael Brown', room: '208', checkIn: '2026-01-19', status: 'Checked In' },
    { id: 'BK-1237', guest: 'Sarah Davis', room: '501', checkIn: '2026-01-22', status: 'Confirmed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Export Report
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all shadow-lg">
            New Booking
          </button>
        </div>
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
            </div>
          );
        })}
      </div>

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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Booking ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Guest Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Room</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Check-In</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{booking.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{booking.guest}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{booking.room}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{booking.checkIn}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                        booking.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
    </div>
  );
}
