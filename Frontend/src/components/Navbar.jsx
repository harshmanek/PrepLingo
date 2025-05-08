"use client"

import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import { ProgressContext } from "../contexts/ProgressContext"
import logo from "../pages/logo.png";
import "./Navbar.css"

const Navbar = () => {
  const { currentUser, logout, streakInfo } = useContext(AuthContext)
  const { userProgress } = useContext(ProgressContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/dashboard" className="navbar-logo">
           <img src={logo} alt="Preplingo" className="auth-logo" />
          <span>Preplingo</span>
        </Link>
      </div>

      {currentUser && (
        <div className="navbar-center">
          <Link to="/dashboard" className="nav-item">
            <i className="fas fa-home"></i>
            <span>Home</span>
          </Link>
          <Link to="/dashboard/generate" className="nav-item">
            <i className="fas fa-robot"></i>
            <span>Generate</span>
          </Link>
          <Link to="/dashboard/quiz/create" className="nav-item">
            <i className="fas fa-question-circle"></i>
            <span>Quiz</span>
          </Link>
          <Link to="/leaderboard" className="nav-item">
            <i className="fas fa-trophy"></i>
            <span>Leaderboard</span>
          </Link>
        </div>
      )}

      {currentUser && (
        <div className="navbar-right">
          <div className="user-stats">
            <div className="streak-counter">
              <i className="fas fa-fire"></i>
              <span>{streakInfo?.streakCount || userProgress.streak}</span>
            </div>
            <div className="xp-counter">
              <i className="fas fa-star"></i>
              <span>{userProgress.xp} XP</span>
            </div>
          </div>

          <div className="user-menu">
            <Link to="/profile" className="profile-link">
              <div className="avatar">{currentUser.username.charAt(0).toUpperCase()}</div>
            </Link>
            <button className="logout-button" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
