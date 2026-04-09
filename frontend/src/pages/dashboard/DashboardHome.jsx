export default function DashboardHome() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome Back 👋</h2>

      <p className="text-gray-600 mb-8">
        Continue learning in your preferred language.
      </p>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm">Courses Enrolled</h3>
          <p className="text-3xl font-bold text-purple-700 mt-2">12</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm">Completed Lessons</h3>
          <p className="text-3xl font-bold text-purple-700 mt-2">48</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm">Certificates Earned</h3>
          <p className="text-3xl font-bold text-purple-700 mt-2">5</p>
        </div>
      </div>
    </div>
  );
}
