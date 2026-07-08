import { LucideIcon } from "lucide-react";
import { UserOut } from "../auth"; 

// ============================================================================
// TYPES D'INTERFACE UTILISATEUR (UI)
// ============================================================================

// Navigation
export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  children?: NavItem[];
}

// Breadcrumbs
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbConfig {
  [key: string]: string;
}

// Composants d'interface
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
  user: UserOut;
  breadcrumbConfig?: BreadcrumbConfig;
  notificationCount?: number;
}

export interface AdminLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  user: UserOut;
  logo?: React.ReactNode;
  breadcrumbConfig?: BreadcrumbConfig;
  defaultSidebarOpen?: boolean;
  defaultCollapsed?: boolean;
}

export interface ProfileDropdownProps {
  user: UserOut;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

export interface BreadcrumbsProps {
  config?: BreadcrumbConfig;
  className?: string;
}

// src/app/types/common/ui.ts

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  count?: number;
  disabled?: boolean;
}

export interface DropdownItem {
  id: string;
  label: string;
  icon?: string;
  onClick?: () => void;
  href?: string;
  divider?: boolean;
  disabled?: boolean;
  danger?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  format?: (value: any, row: T) => string;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface FilterOption {
  field: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'boolean';
  options?: SelectOption[];
  placeholder?: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export interface ChartSeries {
  name: string;
  data: number[];
  color?: string;
}

export interface NotificationToast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger' | 'warning';
  onConfirm: () => void;
  onCancel?: () => void;
}