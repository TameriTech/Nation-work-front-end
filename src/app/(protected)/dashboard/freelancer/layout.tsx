import Header from "@/app/components/freelancer/FreelancerHeader";
import "@/app/globals.css";

export default function FreelancerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html>
        <body>
          <div className="bg-blue-50 min-h-screen p-2 md:p-4 lg:p-6">
            <Header />
            {children}
          </div>
        </body>
      </html>
    </>
  );
}
