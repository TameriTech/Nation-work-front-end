"use client";
import { useState, useCallback } from "react";
import { Sidebar } from "@/app/components/layouts/sidebars/AdminSidebar";
import { Header } from "@/app/components/layouts/headers/AdminHeader";
import { cn } from "@/app/lib/utils";
import type { AdminLayoutProps, NavItem } from "@/app/types/admin";
import {
  BarChart3,
  FileText,
  HelpCircle,
  HomeIcon,
  LayoutDashboard,
  Mail,
  Settings,
  ShoppingCart,
  Users,
  UsersIcon,
} from "lucide-react";
import "@/app/globals.css";

export default function AdminLayout({
  children,
  user,
  logo,
  breadcrumbConfig,
  defaultSidebarOpen = false,
  defaultCollapsed = false,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(defaultSidebarOpen);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const toggleCollapse = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Analytics",
      href: "/dashboard/admin/analytics",
      icon: BarChart3,
      badge: "New",
    },
    {
      title: "Users",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      title: "Orders",
      href: "/dashboard/admin/orders",
      icon: ShoppingCart,
      badge: 12,
    },
    {
      title: "Content",
      href: "/dashboard/admin/content",
      icon: FileText,
      children: [
        {
          title: "Posts",
          href: "/dashboard/admin/content/posts",
          icon: FileText,
        },
        {
          title: "Pages",
          href: "/dashboard/admin/content/pages",
          icon: FileText,
        },
        {
          title: "Media",
          href: "/dashboard/admin/content/media",
          icon: FileText,
        },
      ],
    },
    {
      title: "Messages",
      href: "/dashboard/admin/messages",
      icon: Mail,
    },
    {
      title: "Settings",
      href: "/dashboard/admin/settings",
      icon: Settings,
    },
    {
      title: "Help",
      href: "/dashboard/admin/help",
      icon: HelpCircle,
    },
  ];

  return (
    <div className="flex min-h-screen w-full bg-slate-950">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        navItems={navItems}
        logo={logo}
        collapsed={collapsed}
        onCollapse={toggleCollapse}
      />

      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300",
          collapsed ? "lg:pl-0" : "lg:pl-0"
        )}
      >
        <Header
          onMenuClick={toggleSidebar}
          user={user}
          breadcrumbConfig={breadcrumbConfig}
          notificationCount={3}
        />

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
