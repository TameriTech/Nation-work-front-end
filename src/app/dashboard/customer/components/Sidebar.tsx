import { NavLink } from "@/app/components/layout/customer/NavLink";
import { SidebarProCard } from "./SidebarProCard";
import { Icon } from "@iconify/react";
import { navigation } from "@/data/contants";

export function Sidebar() {
  return (
    <aside className="flex w-56 flex-col bg-white rounded-4xl px-[15px] py-[10px]">
      {/* Logo */}
      <div className="mb-8">
        <span className="text-2xl font-bold">
          <img src="/icons/logo-text.png" alt="Logo" className="h-12" />
        </span>
      </div>

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

      {/* Pro Card */}
      <SidebarProCard />
    </aside>
  );
}
