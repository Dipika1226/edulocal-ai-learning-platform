export function Stats() {
  const stats = [
    { value: "10,000+", label: "Active Learners" },
    { value: "500+", label: "Video Courses" },
    { value: "50+", label: "Partner NGOs" },
    { value: "12", label: "Languages" },
  ];

  return (
    <section className="w-full bg-gradient-to-r from-purple-600 via-blue-500 to-teal-500 py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
        {stats.map((item) => (
          <div key={item.label}>
            <h3 className="text-4xl md:text-5xl font-bold text-white">
              {item.value}
            </h3>
            <p className="mt-2 text-white/90 text-sm md:text-base">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
