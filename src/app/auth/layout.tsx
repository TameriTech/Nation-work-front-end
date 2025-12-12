import Header from "./Components/header";

export default function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { page: "login" | "register" };
}) {
  const page = params.page;
  const image = page === "login" ? "/images/login.png" : "/images/register.png";

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-start p-5 bg-gray-50">
        <Header />
        <main className="grid grid-cols-2 gap-5 w-full items-start justify-between mt-5">
          <div className="relative w-full h-full">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${image})` }}
            />
          </div>
          <div className="w-full bg-white shadow-md rounded-lg">{children}</div>
        </main>
      </div>
    </>
  );
}
