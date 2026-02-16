import { Download, Calendar, TrendingUp, DollarSign, Users, BedDouble, Loader2, AlertCircle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useReport } from '../../hooks/useReport';
import { useEffect, useState, ChangeEvent } from 'react';

interface RoomTypeRevenue {
  name: string;
  value: number;
  color: string;
}

interface FeedbackData {
  category: string;
  rating: number;
}

export default function Reports() {
  const [dateRange, setDateRange] = useState('last6months');
  const [occupancyRange, setOccupancyRange] = useState('thisMonth');

  const {
    occupancyReport,
    revenueReport,
    dashboardSummary,
    loading,
    error,
    fetchOccupancyReport,
    fetchRevenueReport,
    fetchDashboardSummary
  } = useReport();

  // Calculate date ranges
  useEffect(() => {
    const today = new Date();
    const end = today.toISOString().split('T')[0];
    
    let start = '';
    
    if (dateRange === 'last6months') {
      const sixMonthsAgo = new Date(today.setMonth(today.getMonth() - 6));
      start = sixMonthsAgo.toISOString().split('T')[0];
    } else if (dateRange === 'lastYear') {
      const yearAgo = new Date(today.setFullYear(today.getFullYear() - 1));
      start = yearAgo.toISOString().split('T')[0];
    } else {
      start = '2000-01-01'; // All time
    }

    // Fetch all reports
    fetchDashboardSummary();
    fetchOccupancyReport({ startDate: start, endDate: end });
    fetchRevenueReport({ startDate: start, endDate: end });
  }, [dateRange]);

  const handleDateRangeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDateRange(e.target.value);
  };

  const handleOccupancyRangeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setOccupancyRange(e.target.value);
  };

  // Transform data for charts
  const monthlyRevenueData = revenueReport?.data || [
    { month: 'Jan', revenue: 125000, bookings: 180 },
    { month: 'Feb', revenue: 145000, bookings: 210 },
    { month: 'Mar', revenue: 135000, bookings: 195 },
    { month: 'Apr', revenue: 165000, bookings: 240 },
    { month: 'May', revenue: 185000, bookings: 270 },
    { month: 'Jun', revenue: 195000, bookings: 285 },
  ];

  const occupancyTrendData = occupancyReport?.data || [
    { date: '1 Jan', rate: 75 },
    { date: '5 Jan', rate: 80 },
    { date: '10 Jan', rate: 85 },
    { date: '15 Jan', rate: 82 },
    { date: '20 Jan', rate: 88 },
    { date: '25 Jan', rate: 92 },
    { date: '30 Jan', rate: 95 },
  ];

  const roomTypeRevenueData: RoomTypeRevenue[] = revenueReport?.breakdown?.map((item: { roomType: string; revenue: number }) => ({
    name: item.roomType,
    value: item.revenue,
    color: getColorForRoomType(item.roomType)
  })) || [
    { name: 'Deluxe', value: 45000, color: '#10b981' },
    { name: 'Suite', value: 65000, color: '#3b82f6' },
    { name: 'Standard', value: 30000, color: '#f59e0b' },
    { name: 'Premium', value: 55000, color: '#8b5cf6' },
  ];

  const feedbackDataChart: FeedbackData[] = occupancyReport?.ratings || [
    { category: 'Service', rating: 4.8 },
    { category: 'Cleanliness', rating: 4.9 },
    { category: 'Comfort', rating: 4.7 },
    { category: 'Facilities', rating: 4.6 },
    { category: 'Location', rating: 4.8 },
    { category: 'Value', rating: 4.5 },
  ];

  function getColorForRoomType(roomType: string): string {
    const colors: { [key: string]: string } = {
      'Standard': '#f59e0b',
      'Deluxe': '#10b981',
      'Premium': '#8b5cf6',
      'Suite': '#3b82f6'
    };
    return colors[roomType] || '#6b7280';
  }

  if (loading && !dashboardSummary) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-emerald-600 mr-3" size={48} />
        <p className="text-gray-600">Loading reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="text-red-600" size={24} />
          <h3 className="text-red-800 font-semibold">Error Loading Reports</h3>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
      </div>
    );
  }

  // Use real data with fallbacks to mock data
  const metrics = {
    totalRevenue: dashboardSummary?.monthRevenue || 195000,
    revenueChange: '+15.2%',
    occupancyRate: dashboardSummary?.occupancy?.rate ? parseInt(dashboardSummary.occupancy.rate) : 85,
    occupancyChange: '+8.5%',
    totalGuests: 1248,
    guestsChange: '+12.3%',
    totalBookings: 285,
    bookingsChange: '+10.8%'
  };

  const statsBreakdown = {
    roomBookings: 168000,
    additionalServices: 18500,
    foodBeverage: 8500,
    avgDailyRate: 285,
    revPAR: 242,
    avgLengthOfStay: 3.2,
    cancellationRate: 4.8
  };

  const guestDemographics = {
    businessTravelers: 45,
    leisureTravelers: 40,
    returningGuests: 15,
    internationalGuests: 28
  };

  const overallSatisfaction = feedbackDataChart.length > 0
    ? (feedbackDataChart.reduce((sum: number, item: FeedbackData) => sum + item.rating, 0) / feedbackDataChart.length).toFixed(1)
    : 4.7;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={handleDateRangeChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          >
            <option value="last6months">Last 6 Months</option>
            <option value="lastYear">Last Year</option>
            <option value="allTime">All Time</option>
          </select>
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
          <p className="text-3xl font-bold">${(metrics.totalRevenue / 1000).toFixed(0)}k</p>
          <p className="text-sm mt-2 opacity-90">{metrics.revenueChange} from last period</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <BedDouble size={24} />
            </div>
            <TrendingUp size={20} />
          </div>
          <h3 className="text-sm opacity-90 mb-1">Avg Occupancy Rate</h3>
          <p className="text-3xl font-bold">{metrics.occupancyRate}%</p>
          <p className="text-sm mt-2 opacity-90">{metrics.occupancyChange} from last period</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Users size={24} />
            </div>
            <TrendingUp size={20} />
          </div>
          <h3 className="text-sm opacity-90 mb-1">Total Guests</h3>
          <p className="text-3xl font-bold">{metrics.totalGuests.toLocaleString()}</p>
          <p className="text-sm mt-2 opacity-90">{metrics.guestsChange} from last period</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Calendar size={24} />
            </div>
            <TrendingUp size={20} />
          </div>
          <h3 className="text-sm opacity-90 mb-1">Total Bookings</h3>
          <p className="text-3xl font-bold">{metrics.totalBookings.toLocaleString()}</p>
          <p className="text-sm mt-2 opacity-90">{metrics.bookingsChange} from last period</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Monthly Revenue & Bookings</h2>
            <select
              value={dateRange}
              onChange={handleDateRangeChange}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="last6months">Last 6 Months</option>
              <option value="lastYear">Last Year</option>
              <option value="allTime">All Time</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyRevenueData}>
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
            <select
              value={occupancyRange}
              onChange={handleOccupancyRangeChange}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="last3Months">Last 3 Months</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={occupancyTrendData}>
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
                  data={roomTypeRevenueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {roomTypeRevenueData.map((entry: RoomTypeRevenue, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {roomTypeRevenueData.map((item: RoomTypeRevenue, index: number) => (
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
            <BarChart data={feedbackDataChart} layout="vertical">
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
                <span className="text-2xl font-bold text-emerald-600">{overallSatisfaction}</span>
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
                <span className="font-semibold text-gray-900">${(statsBreakdown.roomBookings / 1000).toFixed(0)}k</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Additional Services</span>
                <span className="font-semibold text-gray-900">${(statsBreakdown.additionalServices / 1000).toFixed(1)}k</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Food & Beverage</span>
                <span className="font-semibold text-gray-900">${(statsBreakdown.foodBeverage / 1000).toFixed(1)}k</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-emerald-600">
                  ${((statsBreakdown.roomBookings + statsBreakdown.additionalServices + statsBreakdown.foodBeverage) / 1000).toFixed(0)}k
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Performance Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Avg. Daily Rate</span>
                <span className="font-semibold text-gray-900">${statsBreakdown.avgDailyRate}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">RevPAR</span>
                <span className="font-semibold text-gray-900">${statsBreakdown.revPAR}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Avg. Length of Stay</span>
                <span className="font-semibold text-gray-900">{statsBreakdown.avgLengthOfStay} days</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-gray-600">Cancellation Rate</span>
                <span className="font-semibold text-gray-900">{statsBreakdown.cancellationRate}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Guest Demographics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Business Travelers</span>
                <span className="font-semibold text-gray-900">{guestDemographics.businessTravelers}%</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Leisure Travelers</span>
                <span className="font-semibold text-gray-900">{guestDemographics.leisureTravelers}%</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Returning Guests</span>
                <span className="font-semibold text-gray-900">{guestDemographics.returningGuests}%</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-gray-600">International Guests</span>
                <span className="font-semibold text-gray-900">{guestDemographics.internationalGuests}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}