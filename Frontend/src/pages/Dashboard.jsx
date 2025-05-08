"use client"

import { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import { ProgressContext } from "../contexts/ProgressContext"
import Navbar from "../components/Navbar"
import LoadingSpinner from "../components/LoadingSpinner"
import { quizService } from "../services/api"
import "./Dashboard.css"

const Dashboard = () => {
  const { currentUser, streakInfo } = useContext(AuthContext)
  const { userProgress, loading: progressLoading, fetchQuizStats } = useContext(ProgressContext)
  const [quizHistory, setQuizHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Refresh quiz stats
        await fetchQuizStats()

        // Fetch quiz history
        const history = await quizService.getQuizHistory()
        setQuizHistory(history)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [fetchQuizStats])

  const handleCreateQuiz = () => {
    navigate("/dashboard/quiz/create")
  }

  const handleGenerateQuestions = () => {
    navigate("/dashboard/generate")
  }

  if (loading || progressLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome back, {currentUser.username}!</h1>
          <div className="user-level">
            <div className="level-badge">Level {userProgress.level}</div>
            <div className="xp-progress">
              <div className="xp-bar" style={{ width: `${userProgress.xp % 100}%` }}></div>
              <span>{userProgress.xp % 100}/100 XP to next level</span>
            </div>
          </div>
        </div>

        {/* Streak Card */}
        <div className="streak-card">
          <div className="streak-icon">🔥</div>
          <div className="streak-info">
            <h3>{streakInfo?.streakCount || 0} day streak!</h3>
            <p>
              {streakInfo?.maintainedToday
                ? "You've maintained your streak today!"
                : "Complete a quiz with at least 50% score today to maintain your streak"}
            </p>
          </div>
          <button className="daily-goal-button" onClick={handleCreateQuiz}>
            Complete Daily Quiz
          </button>
        </div>

        {/* Streak Details Section */}
        <div className="streak-details">
          <div className="streak-details-header">
            <h2>Your Streak Progress</h2>
          </div>
          <div className="streak-details-cards">
            <div className="streak-detail-card">
              <div className="streak-detail-icon">🔥</div>
              <div className="streak-detail-value">{streakInfo?.streakCount || 0}</div>
              <div className="streak-detail-label">Current Streak</div>
            </div>
            <div className="streak-detail-card">
              <div className="streak-detail-icon">{streakInfo?.maintainedToday ? "✅" : "⏳"}</div>
              <div className="streak-detail-value">{streakInfo?.maintainedToday ? "Done" : "Pending"}</div>
              <div className="streak-detail-label">Today's Status</div>
            </div>
            <div className="streak-detail-card">
              <div className="streak-detail-icon">🎯</div>
              <div className="streak-detail-value">{Math.min(7, streakInfo?.streakCount || 0)}/7</div>
              <div className="streak-detail-label">Weekly Goal</div>
              <div className="streak-progress-bar">
                <div
                  className="streak-progress-fill"
                  style={{
                    width: `${Math.min(100, ((streakInfo?.streakCount || 0) / 7) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          {quizHistory.length > 0 ? (
            <div className="activity-list">
              {quizHistory.slice(0, 3).map((quiz, index) => {
                const quizNumber = quizHistory.length - index
                const percentage = Math.round((quiz.score / quiz.totalQuestions) * 100)
                const contributedToStreak = percentage >= 50

                return (
                  <div key={quiz.id} className="activity-item">
                    <div className="activity-icon">📝</div>
                    <div className="activity-info">
                      <h3>Quiz #{quizNumber}</h3>
                      <p>
                        Score: {quiz.score}/{quiz.totalQuestions} ({percentage}%)
                      </p>
                      <span className="activity-date">
                        {new Date(quiz.completedAt).toLocaleDateString()} at{" "}
                        {new Date(quiz.completedAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className={`streak-badge ${contributedToStreak ? "streak-maintained" : "streak-broken"}`}>
                      {contributedToStreak ? "+1 Streak" : "No streak"}
                    </div>
                  </div>
                )
              })}
              <button className="view-all-button" onClick={() => navigate("/dashboard/quiz/history")}>
                View All History
              </button>
            </div>
          ) : (
            <div className="empty-state">
              <p>You haven't completed any quizzes yet.</p>
              <button className="primary-button" onClick={handleCreateQuiz}>
                Take Your First Quiz
              </button>
            </div>
          )}
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <div className="action-card" onClick={handleCreateQuiz}>
              <div className="action-icon">🎯</div>
              <div className="action-info">
                <h3>Daily Quiz</h3>
                <p>Complete your daily quiz to maintain your streak</p>
              </div>
            </div>
            <div className="action-card" onClick={handleGenerateQuestions}>
              <div className="action-icon">🤖</div>
              <div className="action-info">
                <h3>Generate Questions</h3>
                <p>Create AI-generated questions on any topic</p>
              </div>
            </div>
            <div className="action-card" onClick={() => navigate("/leaderboard")}>
              <div className="action-icon">🏆</div>
              <div className="action-info">
                <h3>Leaderboard</h3>
                <p>See how you rank against other learners</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
