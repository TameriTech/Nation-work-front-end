import { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  children?: NavItem[];
}

export interface User {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbConfig {
  [key: string]: string;
}

export interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  navItems: NavItem[];
  logo?: React.ReactNode;
  collapsed?: boolean;
  onCollapse?: () => void;
}

export interface HeaderProps {
  onMenuClick: () => void;
  user: User;
  breadcrumbConfig?: BreadcrumbConfig;
  notificationCount?: number;
}

export interface AdminLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  user: User;
  logo?: React.ReactNode;
  breadcrumbConfig?: BreadcrumbConfig;
  defaultSidebarOpen?: boolean;
  defaultCollapsed?: boolean;
}

export interface ProfileDropdownProps {
  user: User;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

export interface BreadcrumbsProps {
  config?: BreadcrumbConfig;
  className?: string;
}
