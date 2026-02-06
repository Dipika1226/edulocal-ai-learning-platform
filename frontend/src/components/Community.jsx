export default function Community() {
  return (
    <section
      id="community"
      className="relative py-28 bg-gradient-to-b from-purple-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT: Content */}
        <div>
          <span className="inline-block mb-4 px-4 py-1 text-sm rounded-full bg-purple-100 text-purple-700 font-medium">
            Community Stories
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Learning Together, Growing Together
          </h2>

          <p className="text-gray-600 mb-10 max-w-xl">
            Thousands of women across rural India are learning, earning, and
            uplifting their communities through EduLocal.
          </p>

          {/* Testimonial Card */}
          <div className="relative bg-purple-900 text-white rounded-3xl p-10 shadow-2xl">
            <span className="absolute top-6 left-6 text-6xl text-purple-700 leading-none">
              “
            </span>

            <p className="relative text-lg leading-relaxed mb-8 z-10">
              EduLocal changed my life. I learned new skills in my own language,
              and now I run my own small business. The AI notes helped me
              remember everything easily.
            </p>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="font-semibold">Priya Sharma</p>
                <p className="text-sm text-white/70">
                  Rural Learner, Maharashtra
                </p>
              </div>

              <button className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 transition font-medium">
                Join Community
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Image */}
        <div className="relative">
          <div className="absolute -inset-4 bg-purple-200 rounded-3xl blur-2xl opacity-40" />
          <img
            alt="Learner testimonial"
            className="relative w-full h-[520px] object-cover rounded-3xl shadow-xl"
            src="https://readdy.ai/api/search-image?query=confident%20rural%20indian%20woman%20using%20smartphone%20for%20learning%20smiling%20natural%20lighting%20warm%20tones%20educational%20empowerment%20portrait%20simple%20background&width=500&height=700&seq=testimonial-woman&orientation=portrait"
          />
        </div>
      </div>
    </section>
  );
}
