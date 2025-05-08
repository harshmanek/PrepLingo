"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import Navbar from "../components/Navbar"
import { quizService } from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"
import "./CreateQuizPage.css"

const CreateQuizPage = () => {
  const [questionCount, setQuestionCount] = useState(5)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasGeneratedQuestions, setHasGeneratedQuestions] = useState(false)
  const { currentUser, streakInfo } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if there are generated questions from the generate page
    const generatedQuestions = sessionStorage.getItem("generatedQuestions")

    if (generatedQuestions) {
      const questions = JSON.parse(generatedQuestions)
      setQuestionCount(questions.length)
      setHasGeneratedQuestions(true)
    }
  }, [])

  const handleCreateQuiz = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Create a quiz with the specified number of questions
      const quiz = await quizService.createQuiz(questionCount)

      // Clear generated questions from session storage
      sessionStorage.removeItem("generatedTopic")
      sessionStorage.removeItem("generatedQuestions")

      // Navigate to the quiz page with the question count as a query parameter
      navigate(`/quiz/${quiz.id}?count=${questionCount}`)
    } catch (err) {
      setError(err.response?.data || "Failed to create quiz. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="create-quiz-container">
        <Navbar />
        <div className="create-quiz-content">
          <div className="loading-container">
            <LoadingSpinner />
            <p>Creating your quiz with {questionCount} questions...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="create-quiz-container">
      <Navbar />

      <div className="create-quiz-content">
        <div className="create-quiz-header">
          <h1>Create Quiz</h1>
          <p>Set up your quiz parameters</p>
        </div>

        <div className="create-quiz-form">
          <div className="form-group">
            <label htmlFor="questionCount">Number of Questions</label>
            <select
              id="questionCount"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number.parseInt(e.target.value))}
              disabled={hasGeneratedQuestions}
            >
              <option value="5">5 Questions</option>
              <option value="10">10 Questions</option>
              <option value="15">15 Questions</option>
              <option value="20">20 Questions</option>
            </select>
            {hasGeneratedQuestions && (
              <p className="info-text">Using {questionCount} questions generated from the previous step</p>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <button className="create-quiz-button" onClick={handleCreateQuiz} disabled={isLoading}>
            {isLoading ? "Creating Quiz..." : "Start Quiz"}
          </button>
        </div>

        <div className="streak-info-card">
          <div className="streak-icon">🔥</div>
          <div className="streak-info">
            <h3>Your Current Streak: {streakInfo?.streakCount || 0} days</h3>
            <p>
              {streakInfo?.maintainedToday
                ? "You've already maintained your streak today!"
                : "Complete this quiz with at least 50% score to maintain your streak"}
            </p>
          </div>
        </div>

        <div className="quiz-info">
          <h2>About Quizzes</h2>
          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon">🎯</div>
              <div className="info-content">
                <h3>Test Your Knowledge</h3>
                <p>Quizzes help you assess your understanding of programming concepts</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">⏱️</div>
              <div className="info-content">
                <h3>Timed Challenges</h3>
                <p>Each quiz has a time limit to simulate real interview conditions</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">🔥</div>
              <div className="info-content">
                <h3>Maintain Your Streak</h3>
                <p>Complete a quiz each day with at least 50% score to build your streak</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateQuizPage
