"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { AuthContext } from "./AuthContext"
import { quizService } from "../services/api"

export const ProgressContext = createContext()

export const ProgressProvider = ({ children }) => {
  const { currentUser, streakInfo, fetchStreakInfo } = useContext(AuthContext)
  const [userProgress, setUserProgress] = useState({
    streak: 0,
    xp: 0,
    completedLessons: [],
    completedQuizzes: [],
    level: 1,
    quizStats: {
      totalQuizzes: 0,
      averageScore: 0,
      bestScore: 0,
    },
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUser) {
      // Update streak from streakInfo if available
      if (streakInfo) {
        setUserProgress((prev) => ({
          ...prev,
          streak: streakInfo.streakCount || 0,
        }))
      }

      // Fetch quiz history to calculate stats
      fetchQuizStats()
    } else {
      setLoading(false)
    }
  }, [currentUser, streakInfo])

  const fetchQuizStats = async () => {
    try {
      const history = await quizService.getQuizHistory()

      // Calculate XP based on quiz history (10 XP per correct answer)
      let totalXP = 0
      let completedQuizIds = []

      if (history && history.length > 0) {
        const completedQuizzes = history.filter((quiz) => quiz.status === "COMPLETED")
        const totalQuizzes = completedQuizzes.length

        completedQuizIds = completedQuizzes.map((quiz) => quiz.id || quiz.quizId)

        if (totalQuizzes > 0) {
          // Calculate total XP (10 XP per correct answer)
          totalXP = completedQuizzes.reduce((sum, quiz) => sum + quiz.score * 10, 0)

          // Calculate average score percentage
          const totalScore = completedQuizzes.reduce((sum, quiz) => {
            const score = (quiz.score / (quiz.totalQuestions || 10)) * 100
            return sum + score
          }, 0)

          const averageScore = Math.round(totalScore / totalQuizzes)

          // Find best score
          const bestScore = Math.round(
            Math.max(...completedQuizzes.map((quiz) => (quiz.score / (quiz.totalQuestions || 10)) * 100)),
          )

          setUserProgress((prev) => ({
            ...prev,
            xp: totalXP,
            level: Math.floor(totalXP / 100) + 1,
            completedQuizzes: completedQuizIds,
            quizStats: {
              totalQuizzes,
              averageScore,
              bestScore,
            },
          }))
        }
      } else {
        // No quiz history, set default values
        setUserProgress((prev) => ({
          ...prev,
          xp: 0,
          level: 1,
          completedQuizzes: [],
          quizStats: {
            totalQuizzes: 0,
            averageScore: 0,
            bestScore: 0,
          },
        }))
      }

      // Mock completed lessons for now
      const mockCompletedLessons = ["java-basics", "java-oop"]

      setUserProgress((prev) => ({
        ...prev,
        completedLessons: mockCompletedLessons,
      }))
    } catch (error) {
      console.error("Error fetching quiz stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const addXP = (amount) => {
    setUserProgress((prev) => {
      const newXP = prev.xp + amount
      const newLevel = Math.floor(newXP / 100) + 1

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
      }
    })
  }

  const completeLesson = (lessonId) => {
    setUserProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) {
        return prev
      }

      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
      }
    })

    // Add XP for completing a lesson
    addXP(20)
  }

  // Fix the completeQuiz function to ensure proper percentage calculation
  const completeQuiz = async (quizId, score, totalQuestions) => {
    try {
      setUserProgress((prev) => {
        if (prev.completedQuizzes.includes(quizId)) {
          return prev
        }

        return {
          ...prev,
          completedQuizzes: [...prev.completedQuizzes, quizId],
        }
      })

      // Add XP based on quiz score (10 XP per correct answer)
      addXP(score * 10)

      // Calculate percentage score - ensure correct calculation
      const percentage = Math.round((score / totalQuestions) * 100)

      // Update streak if score is 50% or higher
      if (percentage >= 50) {
        await fetchStreakInfo()
      }

      // Update quiz stats
      await fetchQuizStats()

      return percentage
    } catch (error) {
      console.error("Error completing quiz:", error)
      return Math.round((score / totalQuestions) * 100) // Return calculated percentage even if there's an error
    }
  }

  const value = {
    userProgress,
    loading,
    addXP,
    completeLesson,
    completeQuiz,
    fetchQuizStats,
  }

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export default ProgressProvider
