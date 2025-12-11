import Header from "../../components/layout/freelancer/header";

export default function FreelancerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="bg-blue-50 min-h-screen p-6">
        <Header />
        {children}
      </div>
    </>
  );
}
