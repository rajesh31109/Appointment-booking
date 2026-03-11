import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  Monitor,
  UserPlus,
  ClipboardList,
} from "lucide-react";

export const sidebarItems = {
  superadmin: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/superadmin" },
    { label: "Hospitals", icon: Building2, path: "/superadmin?tab=hospitals" },
    { label: "Appointments", icon: CalendarCheck, path: "/superadmin?tab=appointments" },
  ],
  reception: (hospitalId: string) => [
    { label: "Dashboard", icon: LayoutDashboard, path: `/reception/dashboard/${hospitalId}` },
    { label: "New Booking", icon: UserPlus, path: `/reception/dashboard/${hospitalId}?action=book` },
    { label: "Queue", icon: ClipboardList, path: `/reception/dashboard/${hospitalId}?tab=queue` },
    { label: "Display Board", icon: Monitor, path: `/display/${hospitalId}` },
  ],
};
