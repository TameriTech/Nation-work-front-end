import { NavLink } from "@/app/components/layout/customer/NavLink";
import { SidebarProCard } from "./SidebarProCard";
import { Icon } from "@iconify/react";
import { navigation } from "@/data/constants";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <aside
      className={`
        fixed lg:static z-50
        h-full lg:h-auto
        w-64
        bg-white rounded-3xl
        px-4 py-4
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-[105%]"}
        lg:translate-x-0
      `}
    >
      {/* Close button (mobile) */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <img src="/icons/logo-text.png" className="h-10 mb-6" />
        <button
          onClick={onClose}
          className="lg:hidden mb-4 text-base text-gray-500 bg-gray-50 flex items-center justify-center w-8 h-8 rounded-lg"
        >
          <Icon icon="bx:x" className="inline-block" />
        </button>
      </div>

      {/* Navigation */}
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        {navigation.map((group) => (
          <div key={group.title} className="mb-6">
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500 text-sidebar-label">
              {group.title}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    className="flex items-center gap-3 rounded-[50px] px-3 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-sidebar-hover"
                    activeClassName="text-white bg-gradient-to-r from-blue-900 to-[#F3742C] shadow-lg"
                  >
                    <Icon icon={item.icon} className="h-5 w-5" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <SidebarProCard />
    </aside>
  );
}
