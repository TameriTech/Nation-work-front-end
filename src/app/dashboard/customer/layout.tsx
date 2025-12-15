import { ReactNode } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";

interface DashboardLayoutProps {
  children: ReactNode; // children is required for layout
  title?: string;
  date?: string;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
}

// **Default export required**
export default function CustomerLayout({
  children,
  title,
  date,
  userName,
  userRole,
  userAvatar,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen gap-5 p-5 bg-linear-to-b from-[#DCEFFF] to-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 ">
          <Header
            title={title}
            date={date}
            userName={userName}
            userRole={userRole}
            userAvatar={userAvatar}
          />
          {children}
        </main>
      </div>
    </div>
  );
}
