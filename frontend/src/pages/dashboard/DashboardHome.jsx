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

      <RecommendationSection />
    </div>
  );
}