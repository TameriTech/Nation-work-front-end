"use client";

import { ServicesTable } from "@/app/components/sections/customer/ServicesTable";
import { Card, CardContent } from "@/app/components/ui/card";
import { useEffect, useState } from "react";
import { getClientServices } from "@/app/services/service.service";
import { Service } from "@/app/types";

export default function DashboardContent() {
  // TODO fetch data from API and replace the hardcoded values
  const [services, setServices] = useState<Service[]>([]);
  useEffect(() => {
    document.title = "Tableau de bord - Services";
    // load services data here
    const fetchData = async () => {
      const data = await getClientServices();
      setServices(data.services as unknown as Service[]);
      console.log(data);
    };
    fetchData();
  }, []);
  return (
    <div className="space-y-6">
      {/* Top Stats Row */}
      <div className="grid  gap-4 grid-cols-1 md:grid-cols-3">
        <Card className="bg-blue-900 text-white rounded-[30px]">
          <CardContent className="flex flex-col items-center justify-between p-5">
            <div className="flex w-full justify-between items-center gap-2">
              <div>
                <p className="text-sm text-slate-400">
                  Candidatures en attente
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-3xl font-bold">{13}</span>
                  <span className="text-xs text-primary-foreground/70">
                    {"+4 depuis hier"}
                  </span>
                </div>
              </div>
              <div className="">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    width="35"
                    height="35"
                    viewBox="0 0 35 35"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.5013 2.91666C9.46588 2.91666 2.91797 9.46457 2.91797 17.5C2.91797 25.5354 9.46588 32.0833 17.5013 32.0833C25.5367 32.0833 32.0846 25.5354 32.0846 17.5C32.0846 9.46457 25.5367 2.91666 17.5013 2.91666ZM23.8451 22.7062C23.6409 23.0562 23.2763 23.2458 22.8971 23.2458C22.7076 23.2458 22.518 23.2021 22.343 23.0854L17.8221 20.3875C16.6992 19.7167 15.868 18.2437 15.868 16.9458V10.9667C15.868 10.3687 16.3638 9.87291 16.9617 9.87291C17.5596 9.87291 18.0555 10.3687 18.0555 10.9667V16.9458C18.0555 17.4708 18.493 18.2437 18.9451 18.5062L23.4659 21.2042C23.9909 21.5104 24.1659 22.1812 23.8451 22.7062Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white text-gray-900 rounded-[30px]">
          <CardContent className="flex flex-col items-center justify-between p-5">
            <div className="flex w-full justify-between items-center gap-2">
              <div>
                <p className="text-sm text-slate-400">Candidatures assignées</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-3xl font-bold">{13}</span>
                  <span className="text-xs text-primary-foreground/70">
                    {"+1 cette semaine"}
                  </span>
                </div>
              </div>
              <div className="">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    width="35"
                    height="35"
                    viewBox="0 0 35 35"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M24.9359 2.91666H18.8109C14.1393 2.91666 12.0452 4.63915 11.723 8.83129C11.6803 9.38657 12.1347 9.84374 12.6916 9.84374H16.1859C22.3109 9.84374 25.1547 12.6875 25.1547 18.8125V22.3068C25.1547 22.8637 25.6119 23.3181 26.1671 23.2755C30.3593 22.9532 32.0818 20.8591 32.0818 16.1875V10.0625C32.0818 4.95832 30.0401 2.91666 24.9359 2.91666Z"
                      fill="#00B500"
                    />
                    <path
                      d="M16.1888 11.6667H10.0638C4.95964 11.6667 2.91797 13.7083 2.91797 18.8125V24.9375C2.91797 30.0417 4.95964 32.0833 10.0638 32.0833H16.1888C21.293 32.0833 23.3346 30.0417 23.3346 24.9375V18.8125C23.3346 13.7083 21.293 11.6667 16.1888 11.6667ZM17.9242 19.9063L12.5138 25.3167C12.3096 25.5208 12.0471 25.6229 11.7701 25.6229C11.493 25.6229 11.2305 25.5208 11.0263 25.3167L8.3138 22.6042C7.90547 22.1958 7.90547 21.5396 8.3138 21.1313C8.72213 20.7229 9.37839 20.7229 9.78672 21.1313L11.7555 23.1L16.4367 18.4188C16.8451 18.0104 17.5013 18.0104 17.9096 18.4188C18.318 18.8271 18.3326 19.4979 17.9242 19.9063Z"
                      fill="#00B500"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white text-gray-900 rounded-[30px]">
          <CardContent className="flex flex-col items-center justify-between p-5">
            <div className="grid grid-cols-12 w-full justify-between items-center gap-2">
              <div className="col-span-10">
                <p className="text-sm text-slate-400">
                  Taux d’acceptation des prestataires
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-3xl font-bold">{"38%"}</span>
                  <span className="text-xs text-primary-foreground/70">
                    {"reflète si ses offres sont attractives"}
                  </span>
                </div>
              </div>
              <div className="col-span-2 flex justify-end">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    width="35"
                    height="35"
                    viewBox="0 0 35 35"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.5013 2.91666C9.4513 2.91666 2.91797 9.44999 2.91797 17.5C2.91797 25.55 9.4513 32.0833 17.5013 32.0833C25.5513 32.0833 32.0846 25.55 32.0846 17.5C32.0846 9.44999 25.5513 2.91666 17.5013 2.91666ZM17.5013 12.7604C16.9034 12.7604 16.4076 12.2646 16.4076 11.6667C16.4076 11.0687 16.9034 10.5729 17.5013 10.5729C21.3221 10.5729 24.4284 13.6792 24.4284 17.5C24.4284 21.3208 21.3221 24.4271 17.5013 24.4271C16.9034 24.4271 16.4076 23.9312 16.4076 23.3333C16.4076 22.7354 16.9034 22.2396 17.5013 22.2396C20.1117 22.2396 22.2409 20.1104 22.2409 17.5C22.2409 14.8896 20.1117 12.7604 17.5013 12.7604ZM17.5013 28.8021C11.2742 28.8021 6.19922 23.7271 6.19922 17.5C6.19922 16.9021 6.69505 16.4062 7.29297 16.4062C7.89089 16.4062 8.38672 16.9021 8.38672 17.5C8.38672 22.5312 12.4701 26.6146 17.5013 26.6146C22.5326 26.6146 26.6159 22.5312 26.6159 17.5C26.6159 12.4687 22.5326 8.38541 17.5013 8.38541C16.9034 8.38541 16.4076 7.88957 16.4076 7.29166C16.4076 6.69374 16.9034 6.19791 17.5013 6.19791C23.7284 6.19791 28.8034 11.2729 28.8034 17.5C28.8034 23.7271 23.7284 28.8021 17.5013 28.8021Z"
                      fill="#05579B"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Table - Takes 2 columns */}
        <div className="col-span-full space-y-6">
          <ServicesTable services={services} />
        </div>
      </div>
    </div>
  );
}
