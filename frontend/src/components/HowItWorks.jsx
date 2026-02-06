import { Upload, Sparkles, PlayCircle, TrendingUp } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Upload or Select Video",
      desc: "Choose a learning video or upload your own content.",
      icon: Upload,
    },
    {
      step: "02",
      title: "AI Processes Content",
      desc: "AI transcribes, translates, and structures the video.",
      icon: Sparkles,
    },
    {
      step: "03",
      title: "Learn with Ease",
      desc: "Watch, read notes, and practice with quizzes.",
      icon: PlayCircle,
    },
    {
      step: "04",
      title: "Grow Continuously",
      desc: "Get recommendations and track your progress.",
      icon: TrendingUp,
    },
  ];

  const stats = [
    { label: "Active Learners", value: "12,000+" },
    { label: "Video Hours", value: "50,000+" },
    { label: "Languages", value: "15+" },
    { label: "Topics Covered", value: "200+" },
  ];

  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            How It Works
          </h2>
          <p className="mt-3 text-gray-600">
            Start your learning journey in four simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="text-center group">
                {/* Icon */}
                <div className="relative mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
                  <Icon size={28} />
                  <span className="absolute -top-2 -right-2 w-7 h-7 text-sm bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold">
                    {item.step}
                  </span>
                </div>

                {/* Text */}
                <h3 className="mt-6 font-semibold text-lg text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 max-w-xs mx-auto">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
