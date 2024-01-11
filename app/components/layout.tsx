export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-sans min-h-screen flex flex-col">
      <div className="w-full px-10 sm:px-10 md:w-3/4 lg:w-5/6 mx-auto">
        {children}
      </div>
    </div>
  );
}
