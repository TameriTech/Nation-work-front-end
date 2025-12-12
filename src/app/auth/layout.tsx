"use client";
import Header from "./Components/header";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { page: "login" | "register" };
}) {
  const page = params.page;
  const image = usePathname().match("/auth/login")
    ? "/images/login.png"
    : "/images/register.png";

  return (
    <>
      <div className="flex flex-col items-center justify-start p-5 bg-gray-50">
        <Header />
        <main className="grid grid-cols-2 gap-5 w-full items-start justify-between mt-5">
          <div className="relative w-full h-full">
            <div
              className="absolute inset-0 bg-cover rounded-2xl bg-top"
              style={{
                backgroundImage: `url(${image})`,
              }}
            />
          </div>
          <div className="w-full bg-transparent p-0 shadow-3xl rounded-lg">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
