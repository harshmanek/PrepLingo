"use client"

import { useNavigate } from "react-router-dom"
import "./QuizResults.css"

const QuizResults = ({ result, quiz }) => {
  const navigate = useNavigate()

  if (!result || !quiz) {
    return null
  }

  return (
    <div className="quiz-result">
      <h1>Quiz Results</h1>

      <div className="result-score">
        <div className="score-circle">
          <span className="score-value">{result.percentage}%</span>
        </div>
        <p className="score-text">
          You answered {result.score} out of {result.totalQuestions} questions correctly
        </p>
        <div className="streak-update">
          {result.percentage >= 50 ? (
            <p className="streak-maintained">🔥 Your streak has been maintained!</p>
          ) : (
            <p className="streak-broken">Your streak requires at least 50% to maintain</p>
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
  )
}

export default QuizResults
