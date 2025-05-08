"use client"

import { createContext, useState, useEffect } from "react"
import { authService } from "../services/auth-service"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [streakInfo, setStreakInfo] = useState(null)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token")
    const refreshToken = localStorage.getItem("refreshToken")

    if (token) {
      try {
        // Decode JWT to get user info
        const payload = JSON.parse(atob(token.split(".")[1]))
        setCurrentUser({
          username: payload.sub,
          exp: payload.exp,
        })

        // Fetch user info and streak info
        fetchUserInfo()
      } catch (err) {
        console.error("Invalid token", err)
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
      }
    }

    setLoading(false)
  }, [])

  const fetchUserInfo = async () => {
    try {
      const userData = await authService.getUserInfo()
      setCurrentUser(userData)

      // Set streak info
      setStreakInfo({
        streakCount: userData.streakCount || 0,
        lastStreakDate: userData.lastStreakDate,
        maintainedToday: userData.maintainedTodayStreak,
      })
    } catch (err) {
      console.error("Failed to fetch user info", err)
      fetchStreakInfo() // Fallback to just fetching streak info
    }
  }

  const fetchStreakInfo = async () => {
    try {
      const streakData = await authService.getStreakInfo()

      // Ensure we have valid streak data with defaults if needed
      const validStreakData = {
        streakCount: streakData?.streakCount || 0,
        lastStreakDate: streakData?.lastStreakDate || null,
        maintainedToday: streakData?.maintainedToday || false,
      }

      setStreakInfo(validStreakData)
      return validStreakData
    } catch (err) {
      console.error("Failed to fetch streak info", err)
      // Return default streak info on error
      return {
        streakCount: 0,
        lastStreakDate: null,
        maintainedToday: false,
      }
    }
  }

  const login = async (username, password) => {
    try {
      setError(null)
      const response = await authService.login(username, password)

      // Store tokens in localStorage
      localStorage.setItem("token", response.accessToken)
      localStorage.setItem("refreshToken", response.refreshToken)

      // Set user from response
      if (response.user) {
        setCurrentUser(response.user)

        // Set streak info
        setStreakInfo({
          streakCount: response.user.streakCount || 0,
          lastStreakDate: response.user.lastStreakDate,
          maintainedToday: response.user.maintainedTodayStreak,
        })
      } else {
        // Fallback to decoding token
        const token = localStorage.getItem("token")
        const payload = JSON.parse(atob(token.split(".")[1]))
        setCurrentUser({
          username: payload.sub,
          exp: payload.exp,
        })

        // Fetch user info to get streak data
        fetchUserInfo()
      }

      return true
    } catch (err) {
      setError(err.response?.data || "Login failed")
      return false
    }
  }

  const register = async (username, password) => {
    try {
      setError(null)
      await authService.register(username, password)
      return true
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed")
      return false
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.error("Logout error", err)
    } finally {
      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
      setCurrentUser(null)
      setStreakInfo(null)
    }
  }

  const refreshUserToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken")
    if (!refreshToken) return false

    try {
      const response = await authService.refreshToken(refreshToken)
      localStorage.setItem("token", response.accessToken)

      // Fetch updated user info
      fetchUserInfo()

      return true
    } catch (err) {
      console.error("Token refresh failed", err)
      logout()
      return false
    }
  }

  // Check if token is about to expire and refresh it
  useEffect(() => {
    if (!currentUser || !currentUser.exp) return

    const tokenExp = currentUser.exp * 1000 // Convert to milliseconds
    const currentTime = Date.now()
    const timeUntilExpiry = tokenExp - currentTime

    // If token expires in less than 5 minutes, refresh it
    if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
      refreshUserToken()
    }

    // Set up a timer to refresh the token before it expires
    const refreshTimer = setTimeout(
      () => {
        refreshUserToken()
      },
      timeUntilExpiry - 5 * 60 * 1000 > 0 ? timeUntilExpiry - 5 * 60 * 1000 : 0,
    ) // 5 minutes before expiry

    return () => clearTimeout(refreshTimer)
  }, [currentUser])

  const value = {
    currentUser,
    streakInfo,
    login,
    register,
    logout,
    refreshUserToken,
    fetchUserInfo,
    fetchStreakInfo,
    loading,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
