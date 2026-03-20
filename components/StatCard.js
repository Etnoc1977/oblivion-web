export default function StatCard({ label, value, sub, icon, color = 'navy' }) {
  const colors = {
    navy: 'from-navy-500/20 to-navy-700/10 border-navy-700',
    teal: 'from-teal-400/20 to-teal-500/10 border-teal-400/30',
    green: 'from-green-500/20 to-green-700/10 border-green-700/30',
    red: 'from-red-500/20 to-red-700/10 border-red-700/30',
    purple: 'from-purple-500/20 to-purple-700/10 border-purple-700/30',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-5`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm">{label}</span>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </div>
  );
}
