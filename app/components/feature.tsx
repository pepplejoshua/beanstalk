export default function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-4 md:w-1/3">
      <div className="flex rounded-lg h-full p-8 flex-col bg-white text-black">
        <div className="flex items-center mb-3 text-center">
          <h2 className="text-lg title-font font-medium">{title}</h2>
        </div>
        <div className="flex-grow">
          <p className="leading-relaxed text-base">{description}</p>
        </div>
      </div>
    </div>
  );
}
