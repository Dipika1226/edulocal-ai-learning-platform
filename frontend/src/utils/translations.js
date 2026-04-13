export const translations = {
  English: {
    dashboard: "Dashboard",
    videoLearning: "Video Learning",
    quizzes: "Quizzes",
    myNotes: "My Notes",
    uploadVideo: "Upload Video",
    history: "History",
    welcomeBack: "Welcome Back 👋",
    continueLearning: "Continue learning in your preferred language.",
    coursesEnrolled: "Courses Enrolled",
    completedLessons: "Completed Lessons",
    certificatesEarned: "Certificates Earned",
    settings: "Settings",
    logout: "Logout",
    language: "Language",
    uploadTitle: "Upload Video 🎥",
    uploadViaLink: "Upload via Link 🔗",
    uploadVideoFile: "Upload Video File 📁",
    uploadBtn: "Upload",
    backToDashboard: "Back to Dashboard",
    selectedFile: "Selected",
    previewTitle: "Now Playing 🎬",
    historyTitle: "Your Upload History 🎬",
    noVideos: "No videos yet",
    untitledVideo: "Untitled Video",
    deleteBtn: "Delete",
    unsupportedVideo: "Unsupported video type",
  },
  Hindi: {
    dashboard: "डैशबोर्ड",
    videoLearning: "वीडियो लर्निंग",
    quizzes: "क्विज़",
    myNotes: "मेरे नोट्स",
    uploadVideo: "वीडियो अपलोड",
    history: "इतिहास",
    welcomeBack: "वापसी पर स्वागत है 👋",
    continueLearning: "अपनी चुनी हुई भाषा में सीखना जारी रखें।",
    coursesEnrolled: "नामांकित पाठ्यक्रम",
    completedLessons: "पूर्ण किए गए पाठ",
    certificatesEarned: "प्राप्त प्रमाणपत्र",
    settings: "सेटिंग्स",
    logout: "लॉगआउट",
    language: "भाषा",
    uploadTitle: "वीडियो अपलोड करें 🎥",
    uploadViaLink: "लिंक द्वारा अपलोड 🔗",
    uploadVideoFile: "वीडियो फ़ाइल अपलोड करें 📁",
    uploadBtn: "अपलोड",
    backToDashboard: "डैशबोर्ड पर वापस जाएँ",
    selectedFile: "चयनित",
    previewTitle: "अभी चल रहा है 🎬",
    historyTitle: "आपकी अपलोड हिस्ट्री 🎬",
    noVideos: "अभी कोई वीडियो नहीं है",
    untitledVideo: "बिना शीर्षक का वीडियो",
    deleteBtn: "डिलीट",
    unsupportedVideo: "यह वीडियो प्रकार समर्थित नहीं है",
  },
};

export const getCurrentLanguage = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  return user.preferredLanguage || "English";
};

export const getText = () => {
  const lang = getCurrentLanguage();
  return translations[lang] || translations.English;
};