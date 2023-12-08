export function TButton({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4">
      <button className="text-white bg-green-500 hover:bg-yellow-600 font-bold py-2 px-4 rounded transition-colors duration-300">
        {children}
      </button>
    </div>
  );
}
