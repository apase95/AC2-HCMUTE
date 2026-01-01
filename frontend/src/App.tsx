import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { Footer } from "./components/main/Footer";
import { BlogPage } from "./pages/BlogPage";
import { DocumentPage } from "./pages/DocumentPage";
import { ExamPage } from "./pages/ExamPage";
import { UploadPage } from "./pages/UploadPage";
import { Header } from "./components/main/Header";
import { HomePage } from "./pages/HomePage";
import { ProfilePage } from "./pages/ProfilePage";
import { PostDetailPage } from "./pages/PostDetailPage";
import { QuizExamPage } from "./pages/QuizExamPage";
import { PreviewExamPage } from "./pages/PreviewExamPage";
import { SettingPage } from "./pages/SettingPage";
import { ExamUploadPage } from "./pages/ExamUploadPage";
import { LayoutParticles } from "./components/sub/LayoutParticles";

function App() {

  return (
    <Router>
      <div className="bg-black min-h-screen text-white">
        <LayoutParticles />
        <Routes>
          <Route path="/" element={<><HomePage /></>} />

          <Route path="/blogs" element={<><Header /><BlogPage /><Footer /></>} />
          <Route path="/documents" element={<><Header /><DocumentPage /><Footer /></>} />
          <Route path="/exams" element={<><Header /><ExamPage /><Footer /></>} />
          
          <Route path="/blogs/:id" element={<><Header /><PostDetailPage /><Footer /></>} />
          <Route path="/documents/:id" element={<><Header /><PostDetailPage /><Footer /></>} />
          <Route path="/exams/:id" element={<><Header /><PreviewExamPage /><Footer /></>} />
          <Route path="/exams/:id/take" element={<QuizExamPage />} /> 
          <Route path="/blogs/edit/:id" element={<><Header /><UploadPage /><Footer /></>} />
          <Route path="/documents/edit/:id" element={<><Header /><UploadPage /><Footer /></>} />

          <Route path="/register" element={<><RegisterPage /><Footer /></>} />
          <Route path="/login" element={<><LoginPage /><Footer /></>} />
          <Route path="/profile" element={<><Header /><ProfilePage /><Footer /></>} />
          <Route path="/settings" element={<><Header /><SettingPage /><Footer /></>} />
          <Route path="/upload" element={<><Header /><UploadPage /><Footer /></>} />
          <Route path="/exams/upload" element={<><Header /><ExamUploadPage /><Footer /></>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App