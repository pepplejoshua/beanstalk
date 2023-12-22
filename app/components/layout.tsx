import { BSHeader } from "./bsheader";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-sans h-screen bg-black text-neutral-50 py-5 flex flex-col">
      <BSHeader />
      <div className="w-full px-10 py-20 sm:px-10 md:w-3/4 lg:w-1/2 mx-auto">
        {children}
      </div>
    </div>
  );
}
