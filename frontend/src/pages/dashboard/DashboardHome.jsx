import { useNavigate } from "react-router-dom";
import { getText } from "../../utils/translations";
import RecommendationSection from "../../components/RecommendationSection";

export default function DashboardHome() {
  const navigate = useNavigate();
  const t = getText();

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900">{t.welcomeBack}</h1>
      <p className="mt-3 text-base text-slate-600">{t.continueLearning}</p>

      {/* Stats */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm">{t.coursesEnrolled}</h3>
          <p className="text-3xl font-bold text-purple-700 mt-2">12</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm">{t.completedLessons}</h3>
          <p className="text-3xl font-bold text-purple-700 mt-2">48</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm">{t.certificatesEarned}</h3>
          <p className="text-3xl font-bold text-purple-700 mt-2">5</p>
        </div>
      </div>

      {/* AI-Powered Recommendations */}
      <RecommendationSection />
    </div>
  );
}