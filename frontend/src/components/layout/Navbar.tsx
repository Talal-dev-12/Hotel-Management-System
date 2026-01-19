import { Search, Bell, User, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  onLogout: () => void;
}

export default function Navbar({ onLogout }: NavbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'New booking from John Doe', time: '5 min ago', unread: true },
    { id: 2, text: 'Room 205 checkout completed', time: '1 hour ago', unread: true },
    { id: 3, text: 'Maintenance request in Room 312', time: '2 hours ago', unread: false },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search guests, rooms, bookings..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 ml-6">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        notif.unread ? 'bg-blue-50' : ''
                      }`}
                    >
                      <p className="text-sm text-gray-800">{notif.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-gray-200">
                  <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left">
                  <User size={16} className="text-gray-600" />
                  <span className="text-sm text-gray-700">Profile</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left">
                  <Settings size={16} className="text-gray-600" />
                  <span className="text-sm text-gray-700">Settings</span>
                </button>
                <div className="border-t border-gray-200"></div>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-left"
                >
                  <LogOut size={16} className="text-red-600" />
                  <span className="text-sm text-red-600">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
