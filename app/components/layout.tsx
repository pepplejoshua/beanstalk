export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen bg-neutral-900 w-full font-sans flex justify-center items-center text-neutral-50">
      {children}
    </div>
  );
}
