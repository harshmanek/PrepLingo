import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { ProgressProvider } from "./contexts/ProgressContext"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import LessonPage from "./pages/LessonPage"
import QuizPage from "./pages/QuizPage"
import ProfilePage from "./pages/ProfilePage"
import LeaderboardPage from "./pages/LeaderboardPage"
import GeneratePage from "./pages/GeneratePage"
import CreateQuizPage from "./pages/CreateQuizPage"
import QuizHistoryPage from "./pages/QuizHistoryPage"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import "./App.css"

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProgressProvider>
          <div className="app-container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/generate"
                element={
                  <ProtectedRoute>
                    <GeneratePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/quiz/create"
                element={
                  <ProtectedRoute>
                    <CreateQuizPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/quiz/history"
                element={
                  <ProtectedRoute>
                    <QuizHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lesson/:topicId"
                element={
                  <ProtectedRoute>
                    <LessonPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quiz/:quizId"
                element={
                  <ProtectedRoute>
                    <QuizPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leaderboard"
                element={
                  <ProtectedRoute>
                    <LeaderboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </ProgressProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
