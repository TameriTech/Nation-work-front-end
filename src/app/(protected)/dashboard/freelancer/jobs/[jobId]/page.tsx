import ClientSidebar from "@/app/components/JobDetail/ClientSidebar";
import JobDetailContent from "@/app/components/JobDetail/JobDetailContent";

const JobDetailPage = () => {
  return (
    <div className="min-h-screen bg-white rounded-3xl  mt-4">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-8">
          {/* Left Sidebar - 30% */}
          <div className="max-w-[312px] shrink-0">
            <div className="bg-card rounded-2xl  border-0 shadow-none ">
              <ClientSidebar />
            </div>
          </div>

          {/* Main Content - 70% */}
          <div className="flex-1">
            <JobDetailContent applied={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
