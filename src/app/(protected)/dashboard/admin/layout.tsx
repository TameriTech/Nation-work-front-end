"use client";
import "@/app/globals.css";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
