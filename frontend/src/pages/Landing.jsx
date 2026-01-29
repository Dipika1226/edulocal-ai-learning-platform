import Navbar from "../components/Navbar";

function Landing() {
  return (
    <>
      <Navbar />

      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Learn in Your Language, At Your Pace
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mb-10">
          AI-powered multilingual video learning platform for regional and rural
          women
        </p>

        <div className="flex gap-4">
          <button className="bg-black text-white px-6 py-3 rounded-md">
            Start Learning
          </button>

          <button className="border border-black px-6 py-3 rounded-md">
            Watch How It Works
          </button>
        </div>
      </section>
    </>
  );
}

export default Landing;
