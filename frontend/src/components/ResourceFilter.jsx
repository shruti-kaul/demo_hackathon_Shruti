export default function ResourceFilter({ categories, activeCategory, onCategoryChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            activeCategory === cat.id
              ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30 shadow-inner'
              : 'bg-surface-800/50 text-surface-400 border border-surface-700/50 hover:text-surface-200 hover:border-surface-600'
          }`}
        >
          <span>{cat.icon}</span>
          <span>{cat.label}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
            activeCategory === cat.id
              ? 'bg-primary-500/30 text-primary-200'
              : 'bg-surface-700/50 text-surface-500'
          }`}>
            {cat.count}
          </span>
        </button>
      ))}
    </div>
  );
}
