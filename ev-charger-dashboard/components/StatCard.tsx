type StatCardProps = {
  title: string;
  value: number;
  color?: string;
};

export default function StatCard({
  title,
  value,
  color = "text-gray-900",
}: StatCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <p className="text-sm text-gray-500">{title}</p>

      <h2 className={`mt-2 text-3xl font-bold ${color}`}>
        {value}
      </h2>
    </div>
  );
}