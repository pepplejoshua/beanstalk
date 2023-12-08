export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono h-screen bg-gradient-to-r from-green-900 via-yellow-600 to-green-500 w-full flex justify-center items-center text-neutral-50">
      <div className="w-full px-4 sm:px-6 md:w-3/4 lg:w-1/2">{children}</div>
    </div>
  );
}
