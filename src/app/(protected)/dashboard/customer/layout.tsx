"use client";

import { ReactNode, useState } from "react";
import { Sidebar } from "@/app/components/layouts/sidebars/CustomerSidebar";
import { Header } from "@/app/components/layouts/headers/GuestHeader";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { ChatProvider } from "@/app/contexts/ChatContext";

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
  //date,
  userName,
  userRole,
  userAvatar,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html>
      <body>
        <AuthProvider>
          <ChatProvider>
            <div className="min-h-screen bg-background dark:bg-gray-900">
              {/* Mobile overlay */}
              {sidebarOpen && (
                <div
                  className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                />
              )}

              <div className="flex gap-2">

                {/* Main content */}
                <div className="flex-1 flex flex-col  mt-24">
                  <Header/>
                  <main className="flex-1">{children}</main>
                </div>
              </div>
            </div>
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
