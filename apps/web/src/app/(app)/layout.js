import AppNavbar from "@/components/layout/AppNavbar";
import SessionBootstrap from "@/components/auth/SessionBootstrap";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-canvas">
      <SessionBootstrap />
      <AppNavbar />
      <main>{children}</main>
    </div>
  );
}
