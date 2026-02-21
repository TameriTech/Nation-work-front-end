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
  CheckCircle,
  UsersIcon,
  CreditCard,
  HelpCircleIcon,
  Group,
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
      children: [
        {
          title: "Users List",
          href: "/dashboard/admin/users/all_users",
          icon: FileText,
        },
        {
          title: "Verifications",
          href: "/dashboard/admin/users/verifications",
          icon: CheckCircle,
        },
      ],
    },

    {
      title: "Services",
      href: "/dashboard/admin/services",
      icon: HelpCircleIcon,
      children: [
        {
          title: "All Services",
          href: "/dashboard/admin/services/all_services",
          icon: HelpCircleIcon,
        },
        {
          title: "Categories",
          href: "/dashboard/admin/services/categories",
          icon: Group,
        },
      ],
    },
    {
      title: "Payments",
      href: "/dashboard/admin/payments",
      icon: CreditCard,
      children: [
        {
          title: "All Payments",
          href: "/dashboard/admin/payments/all_payments",
          icon: CreditCard,
        },
        {
          title: "Payouts",
          href: "/dashboard/admin/payments/payouts",
          icon: ShoppingCart,
        },
      ],
    },
    {
      title: "Disputes",
      href: "/dashboard/admin/disputes",
      icon: HelpCircleIcon,
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
      children: [
        {
          title: "Settings",
          href: "/dashboard/admin/settings/main_settings",
          icon: Settings,
        },
        {
          title: "Activities Log",
          href: "/dashboard/admin/settings/logs",
          icon: FileText,
        },
        {
          title: "Admin Users",
          href: "/dashboard/admin/settings/admins",
          icon: UsersIcon,
        },
      ],
    },
    {
      title: "Help",
      href: "/dashboard/admin/help",
      icon: HelpCircle,
    },
  ];

  return (
    <div className="flex min-h-screen w-full bg-slate-100 dark:bg-slate-950">
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
          collapsed ? "lg:pl-0" : "lg:pl-0",
        )}
      >
        <Header
          onMenuClick={toggleSidebar}
          user={user}
          breadcrumbConfig={breadcrumbConfig}
          notificationCount={3}
        />

        <main className="flex-1 overflow-auto max-h-[calc(100vh-64px)] p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl overflow-x-scroll">{children}</div>
        </main>
      </div>
    </div>
  );
}
