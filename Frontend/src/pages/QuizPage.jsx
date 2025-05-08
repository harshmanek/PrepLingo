"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import { ProgressContext } from "../contexts/ProgressContext"
import Navbar from "../components/Navbar"
import LoadingSpinner from "../components/LoadingSpinner"
import { quizService, questionService } from "../services/api"
import "./QuizPage.css"

const QuizPage = () => {
  const { quizId } = useParams()
  const location = useLocation()
  const { currentUser, fetchStreakInfo, streakInfo } = useContext(AuthContext)
  const { completeQuiz } = useContext(ProgressContext)
  const [quiz, setQuiz] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(null)
  const [error, setError] = useState(null)
  const [streakUpdated, setStreakUpdated] = useState(false)
  const navigate = useNavigate()

  // Get question count from URL query parameters
  const getQuestionCount = () => {
    const searchParams = new URLSearchParams(location.search)
    const count = Number.parseInt(searchParams.get("count"))
    return isNaN(count) ? 5 : count // Default to 5 if not specified
  }

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        // Try to fetch the quiz by ID
        let quizData
        try {
          quizData = await quizService.getQuiz(quizId)
        } catch (err) {
          console.log("Quiz not found, creating mock quiz with random questions")

          // Get question count from URL or default to 5
          const questionCount = getQuestionCount()

          const questions = await questionService.getRandomQuestions(questionCount)

          if (!questions || questions.length === 0) {
            setError("No questions available. Please try again later.")
            setLoading(false)
            return
          }

          quizData = {
            id: quizId,
            questions: questions,
            timeLimit: questionCount * 60, // 1 minute per question
            totalQuestions: questions.length,
            status: "CREATED",
          }
        }

        setQuiz(quizData)
        setTimeLeft(quizData.timeLimit || 300)
      } catch (err) {
        setError(err.response?.data || "Failed to load quiz")
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [quizId, location.search])

  useEffect(() => {
    if (timeLeft === null || showResult) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmitQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, showResult])

  const handleAnswerSelect = (questionId, option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: option,
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      handleSubmitQuiz()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmitQuiz = async () => {
    try {
      setLoading(true)

      // Submit answers to backend
      const submitResult = await quizService.submitQuiz(quizId, selectedAnswers)

      // Calculate score
      const score =
        submitResult.score ||
        Object.keys(selectedAnswers).filter((questionId) => {
          const question = quiz.questions.find((q) => q.id === questionId)
          const correctAnswer = question?.answer.substring(0, 1)
          return selectedAnswers[questionId] === correctAnswer
        }).length

      const totalQuestions = quiz.questions.length
      const percentage = Math.round((score / totalQuestions) * 100)

      // Update streak info
      const streakMaintained = percentage >= 50

      setResult({
        score,
        totalQuestions,
        percentage,
        answers: selectedAnswers,
        streakMaintained,
      })

      // Update progress and streak
      await completeQuiz(quizId, score, totalQuestions)

      // Update streak info in context
      await fetchStreakInfo()
      setStreakUpdated(true)

      // Show results
      setShowResult(true)
    } catch (err) {
      console.error("Error submitting quiz:", err)
      setError(err.response?.data || "Failed to submit quiz")
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  if (loading) {
    return (
      <div className="quiz-container">
        <Navbar />
        <div className="loading-container">
          <LoadingSpinner />
          <p>Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="quiz-container">
        <Navbar />
        <div className="error-state">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="primary-button" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="quiz-container">
        <Navbar />
        <div className="error-state">
          <h2>Quiz not found</h2>
          <p>The quiz you're looking for doesn't exist or has been removed.</p>
          <button className="primary-button" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (showResult) {
    return (
      <div className="quiz-container">
        <Navbar />

        <div className="quiz-result">
          <h1>Quiz Results</h1>

          <div className="result-score">
            <div className="score-circle">
              <span className="score-value">{result.percentage}%</span>
            </div>
            <p className="score-text">
              You answered <strong>{result.score}</strong> out of <strong>{result.totalQuestions}</strong> questions
              correctly
            </p>
            <div className="streak-update">
              {result.percentage >= 50 ? (
                <div className="streak-maintained">
                  <span className="streak-icon">🔥</span> Your streak has been maintained!
                  {streakUpdated && <p className="streak-count">Current streak: {streakInfo?.streakCount || 0} days</p>}
                </div>
              ) : (
                <div className="streak-broken">
                  <span className="streak-icon">❌</span> Your streak requires at least 50% to maintain
                </div>
              )}
            </div>
          </div>

          <div className="result-details">
            <h2>Question Review</h2>

            {quiz.questions.map((question, index) => {
              // Extract just the letter from the correct answer (e.g., "B) It prevents further reassignment" -> "B")
              const correctAnswer = question.answer.substring(0, 1)
              const userAnswer = result.answers[question.id]
              const isCorrect = userAnswer === correctAnswer

              return (
                <div key={question.id} className={`result-question ${isCorrect ? "correct" : "incorrect"}`}>
                  <div className="question-header">
                    <span className="question-number">Question {index + 1}</span>
                    <span className={`question-status ${isCorrect ? "correct" : "incorrect"}`}>
                      {isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>

                  <p className="question-text">{question.question}</p>

                  <div className="question-options">
                    {Object.entries(question.options).map(([key, value]) => (
                      <div
                        key={key}
                        className={`option ${
                          key === correctAnswer
                            ? "correct"
                            : userAnswer === key && userAnswer !== correctAnswer
                              ? "incorrect"
                              : ""
                        }`}
                      >
                        <span className="option-key">{key}</span>
                        <span className="option-value">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="question-explanation">
                    <p>
                      <strong>Explanation:</strong> {question.explanation || "No explanation provided."}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="result-actions">
            <button className="secondary-button" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </button>
            <button className="primary-button" onClick={() => navigate("/dashboard/quiz/create")}>
              Take Another Quiz
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1
  const hasAnswered = selectedAnswers[currentQuestion.id] !== undefined

  return (
    <div className="quiz-container">
      <Navbar />

      <div className="quiz-header">
        <h1>Java Quiz ({quiz.questions.length} Questions)</h1>
        <div className="quiz-progress">
          <div className="progress-text">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="quiz-timer">
          <i className="fas fa-clock"></i>
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="quiz-content">
        <div className="question-card">
          <h2 className="question-text">{currentQuestion.question}</h2>

          <div className="question-options">
            {Object.entries(currentQuestion.options).map(([key, value]) => (
              <div
                key={key}
                className={`option ${selectedAnswers[currentQuestion.id] === key ? "selected" : ""}`}
                onClick={() => handleAnswerSelect(currentQuestion.id, key)}
              >
                <span className="option-key">{key}</span>
                <span className="option-value">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="quiz-navigation">
          <button className="secondary-button" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
            Previous
          </button>

          <div className="question-indicator">
            {quiz.questions.map((_, index) => (
              <div
                key={index}
                className={`indicator ${
                  index === currentQuestionIndex
                    ? "current"
                    : selectedAnswers[quiz.questions[index].id] !== undefined
                      ? "answered"
                      : ""
                }`}
                onClick={() => setCurrentQuestionIndex(index)}
              ></div>
            ))}
          </div>

          <button
            className="primary-button"
            onClick={isLastQuestion ? handleSubmitQuiz : handleNextQuestion}
            disabled={!hasAnswered && isLastQuestion}
          >
            {isLastQuestion ? "Submit Quiz" : "Next"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuizPage
