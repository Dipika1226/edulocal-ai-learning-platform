import {
  Globe,
  PlaySquare,
  FileText,
  HelpCircle,
  Building2,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Multilingual Learning",
    desc: "Access educational content in your preferred language with AI-powered translation and dubbing support.",
  },
  {
    icon: PlaySquare,
    title: "Smart Video Navigation",
    desc: "AI-generated topic timestamps help you jump to exactly what you need to learn.",
  },
  {
    icon: FileText,
    title: "Auto-Generated Notes",
    desc: "Get comprehensive notes automatically created from video content for easy revision.",
  },
  {
    icon: HelpCircle,
    title: "Offline Quizzes",
    desc: "Test your knowledge anytime with downloadable quizzes that work without internet.",
  },
  {
    icon: Building2,
    title: "NGO Partnership",
    desc: "Learn from verified NGOs providing quality content on health, finance, and life skills.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    desc: "Simple, accessible interface designed for users with varying digital literacy levels.",
  },
];

export default function Features() {
  return (
    <section id="features" className="pt-20 pb-18 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Powerful Features for Effective Learning
          </h2>
          <p className="mt-4 text-gray-600">
            Everything you need to learn, grow, and succeed in your educational
            journey.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-purple-100 text-purple-600 mb-4">
                <item.icon size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
