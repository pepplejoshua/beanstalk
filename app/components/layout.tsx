import { BSHeader } from "./bsheader";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono h-screen bg-gradient-to-r from-green-900 via-yellow-600 to-green-500 w-full text-neutral-50 py-5">
      <BSHeader />
      <div className="w-full px-10 sm:px-10 md:w-3/4 lg:w-1/2">{children}</div>
    </div>
  );
}
