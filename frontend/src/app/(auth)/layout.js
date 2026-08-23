import Logo from "@/components/ui/Logo";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-12">
      <div className="w-full max-w-[400px]">
        {/* Logo + Brand */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2.5">
            <Logo className="h-8 w-8" />
            <span className="font-polysans text-xl tracking-[-0.02em] text-graphite">
              LeetAptitude
            </span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
