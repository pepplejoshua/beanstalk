export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-sans min-h-scree py-5 flex flex-col">
      <div className="w-full px-10 py-20 sm:px-10 md:w-3/4 lg:w-1/2 mx-auto">
        {children}
      </div>
    </div>
  );
}
