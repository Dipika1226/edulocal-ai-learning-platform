export default function Hero() {
  return (
    <section className="relative h-screen w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://readdy.ai/api/search-image?query=diverse%20group%20of%20rural%20women%20learning%20together%20in%20bright%20modern%20classroom%20with%20tablets%20and%20books%20warm%20natural%20lighting%20educational%20empowerment%20scene%20soft%20focus%20background%20inspiring%20atmosphere%20contemporary%20indian%20village%20setting&width=1920&height=1080&seq=hero-edulocal-001&orientation=landscape")',
        }}
      ></div>

      {/* Purple Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-purple-700/60"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Learn Anything, <br />
            In Your Own Language
          </h1>

          <p className="mt-6 text-gray-200 text-base md:text-lg">
            EduLocal empowers rural and regional women by transforming global
            video content into local languages using AI-powered translation,
            dubbing, notes, and quizzes.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-md text-sm font-medium transition shadow-md">
              Get Started
            </button>

            <button className="border border-white/70 hover:bg-white hover:text-purple-700 px-6 py-3 rounded-md text-sm font-medium transition">
              How It Works
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
