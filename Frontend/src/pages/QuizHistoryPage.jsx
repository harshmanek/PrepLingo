"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import Navbar from "../components/Navbar"
import LoadingSpinner from "../components/LoadingSpinner"
import { quizService } from "../services/api"
import { formatDistanceToNow } from "date-fns"
import "./QuizHistoryPage.css"

const QuizHistoryPage = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { currentUser } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const historyData = await quizService.getQuizHistory()
        setHistory(historyData)
      } catch (err) {
        setError(err.response?.data || "Failed to load quiz history")
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const getScoreBadgeVariant = (percentage) => {
    if (percentage >= 80) return "success"
    if (percentage >= 60) return "warning"
    return "danger"
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "COMPLETED":
        return "Completed"
      case "IN_PROGRESS":
        return "In Progress"
      case "CREATED":
        return "Not Started"
      default:
        return status
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="history-container">
      <Navbar />

      <div className="history-content">
        <div className="history-header">
          <h1>Quiz History</h1>
          <p>Review your past quiz attempts</p>
        </div>

        {error && (
          <div className="error-state">
            <p>{error}</p>
            <button className="primary-button" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </button>
          </div>
        )}

        {!error && history.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h2>No Quiz History</h2>
            <p>You haven't taken any quizzes yet. Start a quiz to see your history here.</p>
            <button className="primary-button" onClick={() => navigate("/dashboard/quiz/create")}>
              Take Your First Quiz
            </button>
          </div>
        ) : (
          <div className="history-list">
            {history.map((quiz) => {
              const percentage = Math.round((quiz.score / (quiz.totalQuestions || 10)) * 100)

              return (
                <div key={quiz.id} className="history-item">
                  <div className="history-item-header">
                    <h2>Quiz #{quiz.quizId?.substring(0, 8) || quiz.id?.substring(0, 8)}</h2>
                    <div className={`score-badge ${getScoreBadgeVariant(percentage)}`}>{percentage}%</div>
                  </div>

                  <div className="history-item-details">
                    <div className="detail-group">
                      <span className="detail-label">Score:</span>
                      <span className="detail-value">
                        {quiz.score} / {quiz.totalQuestions || 10}
                      </span>
                    </div>

                    <div className="detail-group">
                      <span className="detail-label">Completed:</span>
                      <span className="detail-value">
                        {quiz.completedAt
                          ? formatDistanceToNow(new Date(quiz.completedAt), { addSuffix: true })
                          : "Not completed"}
                      </span>
                    </div>

                    <div className="detail-group">
                      <span className="detail-label">Status:</span>
                      <span className="detail-value">{getStatusLabel(quiz.status)}</span>
                    </div>

                    <div className="detail-group">
                      <span className="detail-label">Streak Impact:</span>
                      <span className="detail-value">
                        {percentage >= 50 ? (
                          <span className="streak-positive">Maintained 🔥</span>
                        ) : (
                          <span className="streak-negative">Below 50% threshold</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="history-item-actions">
                    {quiz.status === "COMPLETED" ? (
                      <button
                        className="secondary-button"
                        onClick={() => navigate(`/quiz/${quiz.quizId || quiz.id}/results`)}
                      >
                        View Details
                      </button>
                    ) : (
                      <button className="secondary-button" onClick={() => navigate(`/quiz/${quiz.quizId || quiz.id}`)}>
                        Continue Quiz
                      </button>
                    )}

                    <button className="primary-button" onClick={() => navigate(`/dashboard/quiz/create`)}>
                      Take Similar Quiz
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default QuizHistoryPage
