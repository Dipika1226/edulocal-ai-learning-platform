const Hero = () => {
  return (
    <section className="bg-blue">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Learn in Your Language,
            <span className="block text-indigo-600">At Your Pace</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            EduLocal is an AI-powered learning platform that converts global
            video content into regional languages, generates topic-wise notes,
            and enables personalized learning for women in rural and semi-urban
            areas.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/signup"
              className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Start Learning
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Watch How It Works <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
