"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import Navbar from "../components/Navbar"
import LoadingSpinner from "../components/LoadingSpinner"
import "./LeaderboardPage.css"

const LeaderboardPage = () => {
  const { currentUser } = useContext(AuthContext)
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("week")

  useEffect(() => {
    // In a real app, fetch leaderboard data from the backend
    // For now, we'll use mock data
    const mockLeaderboard = [
      {
        username: "java_master",
        xp: 2450,
        level: 25,
        streak: 15,
      },
      {
        username: "code_ninja",
        xp: 2100,
        level: 22,
        streak: 8,
      },
      {
        username: currentUser.username,
        xp: 1850,
        level: 19,
        streak: 5,
      },
      {
        username: "dev_guru",
        xp: 1700,
        level: 18,
        streak: 7,
      },
      {
        username: "tech_wizard",
        xp: 1550,
        level: 16,
        streak: 4,
      },
      {
        username: "coding_pro",
        xp: 1400,
        level: 15,
        streak: 6,
      },
      {
        username: "algorithm_ace",
        xp: 1250,
        level: 13,
        streak: 3,
      },
      {
        username: "byte_master",
        xp: 1100,
        level: 12,
        streak: 2,
      },
      {
        username: "syntax_expert",
        xp: 950,
        level: 10,
        streak: 4,
      },
      {
        username: "debug_hero",
        xp: 800,
        level: 9,
        streak: 1,
      },
    ]

    // Sort by XP
    mockLeaderboard.sort((a, b) => b.xp - a.xp)

    setLeaderboard(mockLeaderboard)
    setLoading(false)
  }, [currentUser, timeframe])

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe)
    setLoading(true)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="leaderboard-container">
      <Navbar />

      <div className="leaderboard-content">
        <div className="leaderboard-header">
          <h1>Leaderboard</h1>
          <div className="timeframe-selector">
            <button
              className={`timeframe-button ${timeframe === "day" ? "active" : ""}`}
              onClick={() => handleTimeframeChange("day")}
            >
              Today
            </button>
            <button
              className={`timeframe-button ${timeframe === "week" ? "active" : ""}`}
              onClick={() => handleTimeframeChange("week")}
            >
              This Week
            </button>
            <button
              className={`timeframe-button ${timeframe === "month" ? "active" : ""}`}
              onClick={() => handleTimeframeChange("month")}
            >
              This Month
            </button>
            <button
              className={`timeframe-button ${timeframe === "all" ? "active" : ""}`}
              onClick={() => handleTimeframeChange("all")}
            >
              All Time
            </button>
          </div>
        </div>

        <div className="leaderboard-table">
          <div className="leaderboard-header-row">
            <div className="rank-column">Rank</div>
            <div className="user-column">User</div>
            <div className="xp-column">XP</div>
            <div className="level-column">Level</div>
            <div className="streak-column">Streak</div>
          </div>

          {leaderboard.map((user, index) => (
            <div
              key={user.username}
              className={`leaderboard-row ${user.username === currentUser.username ? "current-user" : ""}`}
            >
              <div className="rank-column">
                {index < 3 ? (
                  <div className={`trophy trophy-${index + 1}`}>{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</div>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="user-column">
                <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
                <span className="username">{user.username}</span>
              </div>
              <div className="xp-column">{user.xp} XP</div>
              <div className="level-column">Level {user.level}</div>
              <div className="streak-column">
                <span className="streak-icon">🔥</span>
                <span>{user.streak}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LeaderboardPage
