"use client";

import { ReactNode, useState } from "react";
import { Sidebar } from "@/app/components/layouts/sidebars/CustomerSidebar";
import { Header } from "@/app/components/layouts/headers/CustomerHeader";
import "@/app/globals.css";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  date?: string;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
}

export default function CustomerLayout({
  children,
  title,
  date,
  userName,
  userRole,
  userAvatar,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-linear-to-b from-[#DCEFFF] to-white">
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div className="flex gap-2 p-4">
            {/* Sidebar */}
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content */}
            <div className="flex-1 flex flex-col">
              <Header
                title={title}
                date={date}
                userName={userName}
                userRole={userRole}
                userAvatar={userAvatar}
                onMenuClick={() => setSidebarOpen(true)}
              />
              <main className="flex-1 mt-4">{children}</main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
