import { Download, Calendar, TrendingUp, DollarSign, Users, BedDouble } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function Reports() {
  const monthlyRevenue = [
    { month: 'Jan', revenue: 125000, bookings: 180 },
    { month: 'Feb', revenue: 145000, bookings: 210 },
    { month: 'Mar', revenue: 135000, bookings: 195 },
    { month: 'Apr', revenue: 165000, bookings: 240 },
    { month: 'May', revenue: 185000, bookings: 270 },
    { month: 'Jun', revenue: 195000, bookings: 285 },
  ];

  const occupancyTrend = [
    { date: '1 Jan', rate: 75 },
    { date: '5 Jan', rate: 80 },
    { date: '10 Jan', rate: 85 },
    { date: '15 Jan', rate: 82 },
    { date: '20 Jan', rate: 88 },
    { date: '25 Jan', rate: 92 },
    { date: '30 Jan', rate: 95 },
  ];

  const roomTypeRevenue = [
    { name: 'Deluxe', value: 45000, color: '#10b981' },
    { name: 'Suite', value: 65000, color: '#3b82f6' },
    { name: 'Standard', value: 30000, color: '#f59e0b' },
    { name: 'Premium', value: 55000, color: '#8b5cf6' },
  ];

  const feedbackData = [
    { category: 'Service', rating: 4.8 },
    { category: 'Cleanliness', rating: 4.9 },
    { category: 'Comfort', rating: 4.7 },
    { category: 'Facilities', rating: 4.6 },
    { category: 'Location', rating: 4.8 },
    { category: 'Value', rating: 4.5 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={20} />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <DollarSign size={24} />
            </div>
            <TrendingUp size={20} />
          </div>
          <h3 className="text-sm opacity-90 mb-1">Total Revenue</h3>
          <p className="text-3xl font-bold">$195,000</p>
          <p className="text-sm mt-2 opacity-90">+15.2% from last month</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <BedDouble size={24} />
            </div>
            <TrendingUp size={20} />
          </div>
          <h3 className="text-sm opacity-90 mb-1">Avg Occupancy Rate</h3>
          <p className="text-3xl font-bold">85%</p>
          <p className="text-sm mt-2 opacity-90">+8.5% from last month</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Users size={24} />
            </div>
            <TrendingUp size={20} />
          </div>
          <h3 className="text-sm opacity-90 mb-1">Total Guests</h3>
          <p className="text-3xl font-bold">1,248</p>
          <p className="text-sm mt-2 opacity-90">+12.3% from last month</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Calendar size={24} />
            </div>
            <TrendingUp size={20} />
          </div>
          <h3 className="text-sm opacity-90 mb-1">Total Bookings</h3>
          <p className="text-3xl font-bold">285</p>
          <p className="text-sm mt-2 opacity-90">+10.8% from last month</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Monthly Revenue & Bookings</h2>
            <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>Last 6 Months</option>
              <option>Last Year</option>
              <option>All Time</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Occupancy Trend */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Occupancy Rate Trend</h2>
            <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={occupancyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Room Type Revenue */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Revenue by Room Type</h2>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roomTypeRevenue}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {roomTypeRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {roomTypeRevenue.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">${(item.value / 1000).toFixed(0)}k</span>
              </div>
            ))}
          </div>
        </div>

        {/* Guest Satisfaction */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Guest Satisfaction Ratings</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={feedbackData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" domain={[0, 5]} stroke="#9ca3af" />
              <YAxis dataKey="category" type="category" stroke="#9ca3af" width={80} />
              <Tooltip />
              <Bar dataKey="rating" fill="#10b981" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Overall Satisfaction</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-emerald-600">4.7</span>
                <span className="text-sm text-gray-600">/ 5.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Detailed Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Revenue Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Room Bookings</span>
                <span className="font-semibold text-gray-900">$168,000</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Additional Services</span>
                <span className="font-semibold text-gray-900">$18,500</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Food & Beverage</span>
                <span className="font-semibold text-gray-900">$8,500</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-emerald-600">$195,000</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Performance Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Avg. Daily Rate</span>
                <span className="font-semibold text-gray-900">$285</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">RevPAR</span>
                <span className="font-semibold text-gray-900">$242</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Avg. Length of Stay</span>
                <span className="font-semibold text-gray-900">3.2 days</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-gray-600">Cancellation Rate</span>
                <span className="font-semibold text-gray-900">4.8%</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Guest Demographics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Business Travelers</span>
                <span className="font-semibold text-gray-900">45%</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Leisure Travelers</span>
                <span className="font-semibold text-gray-900">40%</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Returning Guests</span>
                <span className="font-semibold text-gray-900">15%</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-gray-600">International Guests</span>
                <span className="font-semibold text-gray-900">28%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
