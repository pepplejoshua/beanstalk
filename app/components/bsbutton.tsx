export function BSButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={"p-2" + (className ?? "")}>
      <button className="text-white bg-green-600 hover:bg-green-500 py-3 px-5 rounded-full inline-flex items-center">
        {children}
      </button>
    </div>
  );
}
