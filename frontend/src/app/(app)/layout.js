import Sidebar from "@/components/layout/Sidebar";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar />
      <div className="lg:pl-64">{children}</div>
    </div>
  );
}
