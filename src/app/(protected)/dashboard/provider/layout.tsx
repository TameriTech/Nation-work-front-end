import { Header } from "@/app/components/layouts/headers/GuestHeader";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { ChatProvider } from "@/app/contexts/ChatContext";

export default function providerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AuthProvider>
        <ChatProvider>
          <div className="bg-blue-50 min-h-screen">
            <Header />
            {children}
          </div>
        </ChatProvider>
      </AuthProvider>
    </>
  );
}
