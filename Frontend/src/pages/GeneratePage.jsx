"use client"

import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import Navbar from "../components/Navbar"
import { gptService, questionService } from "../services/api"
import QuestionCard from "../components/QuestionCard"
import LoadingSpinner from "../components/LoadingSpinner"
import "./GeneratePage.css"

const GeneratePage = () => {
  const [topic, setTopic] = useState("")
  const [count, setCount] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [questions, setQuestions] = useState([])
  const [error, setError] = useState(null)
  const { currentUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleGenerate = async () => {
    if (!topic) {
      setError("Please enter a topic to generate questions")
      return
    }

    setIsLoading(true)
    setError(null)
    setQuestions([])

    try {
      const data = await gptService.generateMultipleQuestions(topic, count)

      // Process the response to extract questions
      let extractedQuestions = []
      data.forEach((response) => {
        if (response.questions) {
          extractedQuestions = [...extractedQuestions, ...response.questions]
        }
      })

      setQuestions(extractedQuestions)
    } catch (err) {
      setError(err.response?.data || "Failed to generate questions. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveQuestions = async () => {
    if (questions.length === 0) return

    setIsSaving(true)
    setError(null)

    try {
      await questionService.storeQuestions(topic, count)
      setIsSaving(false)
      // Show success message
      alert("Questions saved successfully!")
    } catch (err) {
      setError(err.response?.data || "Failed to save questions")
      setIsSaving(false)
    }
  }

  const handleCreateQuiz = () => {
    if (questions.length === 0) return

    // Store the generated questions in session storage to use in quiz creation
    sessionStorage.setItem("generatedQuestions", JSON.stringify(questions))
    sessionStorage.setItem("generatedTopic", topic)

    navigate("/dashboard/quiz/create")
  }

  if (isLoading) {
    return (
      <div className="generate-container">
        <Navbar />
        <div className="generate-content">
          <div className="generate-header">
            <h1>Generate Questions</h1>
            <p>Creating questions on {topic}...</p>
          </div>
          <div className="loading-container">
            <LoadingSpinner />
            <p>This may take a moment. We're generating high-quality questions for you.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="generate-container">
      <Navbar />

      <div className="generate-content">
        <div className="generate-header">
          <h1>Generate Questions</h1>
          <p>Create AI-generated questions on any topic</p>
        </div>

        <div className="generate-form">
          <div className="form-group">
            <label htmlFor="topic">Topic</label>
            <input
              id="topic"
              type="text"
              placeholder="e.g. Java Collections, Spring Boot, Data Structures"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="count">Number of Questions</label>
            <select id="count" value={count} onChange={(e) => setCount(Number.parseInt(e.target.value))}>
              <option value="1">1 Question</option>
              <option value="3">3 Questions</option>
              <option value="5">5 Questions</option>
              <option value="10">10 Questions</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button className="generate-button" onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Questions"}
          </button>
        </div>

        {questions.length > 0 && (
          <div className="questions-section">
            <div className="questions-header">
              <h2>Generated Questions</h2>
              <div className="questions-actions">
                <button className="secondary-button" onClick={handleSaveQuestions} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Questions"}
                </button>
                <button className="primary-button" onClick={handleCreateQuiz}>
                  Create Quiz with These Questions
                </button>
              </div>
            </div>

            <div className="questions-list">
              {questions.map((question, index) => (
                <QuestionCard key={index} question={question} number={index + 1} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GeneratePage
