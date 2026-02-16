import ClientSidebar from "@/app/components/features/job-detail/ClientSidebar";
import JobDetailContent from "@/app/components/features/job-detail/JobDetailContent";
import { getClientServices, getService } from "@/app/services/service.service";
import { request } from "http";
import { useEffect, useState } from "react";

const JobDetailPage = ({
  params,
}: {
  params: Promise<{ serviceId: number }>;
}) => {
  const { serviceId } = params as unknown as { serviceId: number };
  const [service, setService] = useState(null);

  const getServiceDetails = async (serviceId: number) => {
    try {
      const response = await getService(serviceId);
      const data = await response;
      return data;
    } catch (error) {
      console.error("Error fetching service details:", error);
      return null;
    }
  };

  useEffect(() => {
    getServiceDetails(serviceId);
  }, [serviceId]);

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
            {" "}
            {/** 
            <JobDetailContent applied={false} service={service} />*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
