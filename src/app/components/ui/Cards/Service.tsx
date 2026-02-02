export function ServiceCard({ title }: { title: string }) {
  return (
    <div className="border rounded-[30px] p-5 shadow-sm w-min bg-gray-100">
      <div className="bg-gray-200 rounded-[30px] mb-3 w-[220px] h-[154px] mx-auto"></div>
      <p className="font-medium text-sm text-gray-800">{title}</p>
    </div>
  );
}
