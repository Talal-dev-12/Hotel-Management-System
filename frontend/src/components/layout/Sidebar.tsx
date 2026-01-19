import { 
  LayoutDashboard, 
  Users, 
  BedDouble, 
  Calendar, 
  LogIn, 
  Receipt, 
  Sparkles, 
  BarChart3, 
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ currentPage, onNavigate, isCollapsed, onToggle }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'users', icon: Users, label: 'User Management' },
    { id: 'rooms', icon: BedDouble, label: 'Room Management' },
    { id: 'reservations', icon: Calendar, label: 'Reservations' },
    { id: 'checkin', icon: LogIn, label: 'Check-In/Out' },
    { id: 'billing', icon: Receipt, label: 'Billing & Invoice' },
    { id: 'housekeeping', icon: Sparkles, label: 'Housekeeping' },
    { id: 'reports', icon: BarChart3, label: 'Reports' },
    { id: 'feedback', icon: MessageSquare, label: 'Feedback' },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 z-50 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between p-6 border-b border-slate-700">
        {!isCollapsed && (
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              LuxuryStay
            </h1>
            <p className="text-xs text-slate-400 mt-1">Hospitality</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="mt-6 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-500 shadow-lg shadow-emerald-500/20'
                  : 'hover:bg-slate-700'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <Icon size={20} />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-lg p-4 border border-emerald-500/20">
            <p className="text-xs text-slate-300">Premium Edition</p>
            <p className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Pro Plan
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
