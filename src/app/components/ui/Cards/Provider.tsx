type Provider = {
  name: string;
  occupation: string;
  rate: number;
  skills: string[];
};

type ProviderCardProps = {
  provider: Provider;
  index: number;
  renderStars: (rate: number) => React.ReactNode;
};

export function ProviderCard({
  provider,
  index,
  renderStars,
}: ProviderCardProps) {
  return (
    <div
      key={index}
      className="border rounded-[10px] pb-3 shadow-sm w-full bg-gray-100"
    >
      <div className="bg-gray-200 rounded-t-[10px] mb-3 w-full h-[183px] mx-auto"></div>

      <div className="px-5">
        <p className="font-normal text-base text-gray-800">{provider.name}</p>

        <p className="text-lg font-medium text-gray-500">
          {provider.occupation}
        </p>

        <div className="flex items-center mt-1 text-yellow-500 text-sm">
          {renderStars(provider.rate)}
          <span className="text-gray-500 text-xs ml-2">
            ({provider.rate.toFixed(1)})
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {provider.skills.map((skill, idx) => (
            <span
              key={idx}
              className="bg-white text-gray-700 text-xs px-2 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
