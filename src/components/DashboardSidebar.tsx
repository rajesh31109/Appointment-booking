import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  // Stethoscope, (removed)
  CalendarCheck,
  Monitor,
  Settings,
  LogOut,
  Building2,
  BarChart3,
  UserPlus,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

interface DashboardSidebarProps {
  brand: string;
  items: SidebarItem[];
  onLogout: () => void;
  userName?: string;
  userRole?: string;
}

// Moved sidebarItems to sidebarItems.ts for fast refresh compliance

import { sidebarItems } from './sidebarItems'; // Import the sidebarItems from the new file

const DashboardSidebar = ({ brand, items, onLogout, userName, userRole }: DashboardSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col z-40">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">{brand}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const isActive = location.pathname === item.path.split("?")[0] &&
            (item.path.includes("?") ? location.search.includes(item.path.split("?")[1]) : true);
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800">
        {userName && (
          <div className="flex items-center gap-3 px-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm font-bold text-blue-600">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{userName}</p>
              {userRole && <p className="text-xs text-gray-400 capitalize">{userRole}</p>}
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 transition-all"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Log out
        </button>
      </div>
    </aside>
  );
};

/** Wrapper for dashboard page content with sidebar */
export const DashboardLayout = ({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {sidebar}
      <div className="ml-64">
        {children}
      </div>
    </div>
  );
};

export default DashboardSidebar;
