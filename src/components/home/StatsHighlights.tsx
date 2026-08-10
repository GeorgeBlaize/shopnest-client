const STATS = [
  { value: '50K+', label: 'Orders Delivered' },
  { value: '8', label: 'Product Categories' },
  { value: '4.6/5', label: 'Average Rating' },
  { value: '24/7', label: 'Customer Support' },
];

export function StatsHighlights() {
  return (
    <section className="bg-brand py-12 text-brand-foreground">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="mt-1 text-sm opacity-90">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
