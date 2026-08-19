import AppNavbar from "@/components/layout/AppNavbar";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-canvas">
      <AppNavbar />
      <main>{children}</main>
    </div>
  );
}
