import { CustomerHeader } from "./components/CustomerHeader";
import { CustomerProfileSidebar } from "./components/CustomerProfileSidebar";
import { ProfileTabs } from "./components/ProfileTabs";

export default function CustomerHomePage() {
  return (
    <div className="min-h-screen text-gray-800">
      <main className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sidebar - Profile */}
          <CustomerProfileSidebar />

          {/* Right content - Tabs */}
          <div className="flex-1 min-w-0">
            <ProfileTabs />
          </div>
        </div>
      </main>
    </div>
  );
}
