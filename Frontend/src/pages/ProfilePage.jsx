"use client";

import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { ProgressContext } from "../contexts/ProgressContext";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { currentUser, streakInfo, fetchStreakInfo } = useContext(AuthContext);
  const { userProgress, fetchQuizStats } = useContext(ProgressContext);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default progress values to prevent undefined errors
  const defaultProgress = {
    level: 1,
    xp: 0,
    streak: 0,
    completedLessons: [],
    completedQuizzes: [],
    quizStats: {
      totalQuizzes: 0,
      averageScore: 0,
      bestScore: 0,
    },
  };

  // Set username when currentUser is available
  // Improve the data fetching to handle errors better
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!currentUser) {
          setLoading(false);
          return; // Exit early if no user, but don't throw error
        }

        const promises = [
          fetchStreakInfo ? fetchStreakInfo() : Promise.resolve(null),
          fetchQuizStats ? fetchQuizStats() : Promise.resolve(null),
        ];

        const results = await Promise.allSettled(promises);

        // Check for any failed promises
        const failedResults = results.filter(
          (result) => result.status === "rejected"
        );
        if (failedResults.length > 0) {
          console.error("Some requests failed:", failedResults);
          // Log the specific errors
          failedResults.forEach((result, index) => {
            console.error(`API call ${index + 1} failed:`, result.reason);
          });

          // Only set error if all promises failed
          if (failedResults.length === promises.length) {
            throw new Error("Failed to load profile data");
          }
        }

        // Process successful results
        results.forEach((result, index) => {
          if (result.status === "fulfilled" && result.value) {
            if (index === 0 && result.value) {
              // Handle streak info success
              console.log("Streak info loaded successfully");
            } else if (index === 1 && result.value) {
              // Handle quiz stats success
              console.log("Quiz stats loaded successfully");
            }
          }
        });
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError(
          err.message || "Failed to load profile data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, fetchStreakInfo, fetchQuizStats]);

  const handleSaveProfile = () => {
    // In a real app, save profile changes to the backend
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      console.error("Error formatting date:", e);
      return "N/A";
    }
  };

  // Use the defaultProgress as a fallback
  const progress = userProgress || defaultProgress;

  if (loading) {
    return (
      <div className="profile-container">
        <Navbar />
        <div className="loading-container">
          <LoadingSpinner />
          <p>Loading your profile data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <Navbar />
        <div className="error-state">
          <h2>Error Loading Profile</h2>
          <p>{error}</p>
          <button
            className="primary-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Check if user is logged in
  if (!currentUser) {
    return (
      <div className="profile-container">
        <Navbar />
        <div className="error-state">
          <h2>Not Logged In</h2>
          <p>Please log in to view your profile.</p>
          <button
            className="primary-button"
            onClick={() => (window.location.href = "/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <Navbar />

      <div className="profile-content">
        <div className="profile-header">
          <h1>My Profile</h1>
        </div>

        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {currentUser?.username?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="level-badge">Level {progress.level}</div>
          </div>

          <div className="profile-details">
            {isEditing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="form-actions">
                  <button
                    className="profile-button secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="profile-button primary"
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="profile-info">
                  <h2>{currentUser?.username || "User"}</h2>
                  <p>
                    Member since{" "}
                    {formatDate(currentUser?.createdAt || new Date())}
                  </p>
                </div>

                <button
                  className="profile-button primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>

        <div className="stats-card">
          <h2>Your Stats</h2>

          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">🔥</div>
              <div className="stat-value">
                {streakInfo?.streakCount || progress.streak || 0}
              </div>
              <div className="stat-label">Day Streak</div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">⭐</div>
              <div className="stat-value">{progress.xp || 0}</div>
              <div className="stat-label">Total XP</div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">📚</div>
              <div className="stat-value">
                {progress.completedLessons?.length || 0}
              </div>
              <div className="stat-label">Lessons Completed</div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">📝</div>
              <div className="stat-value">
                {progress.quizStats?.totalQuizzes || 0}
              </div>
              <div className="stat-label">Quizzes Completed</div>
            </div>
          </div>

          <div className="stats-grid mt-4">
            <div className="stat-item">
              <div className="stat-icon">📊</div>
              <div className="stat-value">
                {progress.quizStats?.averageScore || 0}%
              </div>
              <div className="stat-label">Average Score</div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">🏆</div>
              <div className="stat-value">
                {progress.quizStats?.bestScore || 0}%
              </div>
              <div className="stat-label">Best Score</div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">📅</div>
              <div className="stat-value">
                {streakInfo?.maintainedToday ? "Yes" : "No"}
              </div>
              <div className="stat-label">Today's Streak</div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">📆</div>
              <div className="stat-value">
                {formatDate(streakInfo?.lastStreakDate)}
              </div>
              <div className="stat-label">Last Streak Date</div>
            </div>
          </div>
        </div>

        <div className="streak-explanation-card">
          <h2>How Streaks Work</h2>
          <div className="streak-explanation">
            <p>
              <strong>🔥 Building Your Streak:</strong> Complete at least one
              quiz per day with a score of 50% or higher to maintain your
              streak.
            </p>
            <p>
              <strong>⏰ Daily Reset:</strong> Your "maintained today" status
              resets at midnight, giving you a fresh opportunity each day.
            </p>
            <p>
              <strong>🏆 Streak Benefits:</strong> Longer streaks unlock
              achievements and boost your position on the leaderboard.
            </p>
          </div>
        </div>

        <div className="achievements-card">
          <h2>Achievements</h2>

          <div className="achievements-grid">
            <div
              className={`achievement-item ${
                (progress.completedLessons?.length || 0) > 0 ? "unlocked" : ""
              }`}
            >
              <div className="achievement-icon">🏆</div>
              <div className="achievement-info">
                <h3>First Steps</h3>
                <p>Complete your first lesson</p>
              </div>
            </div>

            <div
              className={`achievement-item ${
                (streakInfo?.streakCount || 0) >= 3 ? "unlocked" : ""
              }`}
            >
              <div className="achievement-icon">🔥</div>
              <div className="achievement-info">
                <h3>On Fire</h3>
                <p>Maintain a 3-day streak</p>
              </div>
            </div>

            <div
              className={`achievement-item ${
                (progress.quizStats?.bestScore || 0) >= 100 ? "unlocked" : ""
              }`}
            >
              <div className="achievement-icon">🌟</div>
              <div className="achievement-info">
                <h3>Perfect Score</h3>
                <p>Get 100% on a quiz</p>
              </div>
            </div>

            <div
              className={`achievement-item ${
                (progress.completedLessons || []).includes("java-basics")
                  ? "unlocked"
                  : ""
              }`}
            >
              <div className="achievement-icon">🧠</div>
              <div className="achievement-info">
                <h3>Knowledge Master</h3>
                <p>Complete all Java basics lessons</p>
              </div>
            </div>

            <div
              className={`achievement-item ${
                (streakInfo?.streakCount || 0) >= 7 ? "unlocked" : ""
              }`}
            >
              <div className="achievement-icon">📅</div>
              <div className="achievement-info">
                <h3>Weekly Warrior</h3>
                <p>Maintain a 7-day streak</p>
              </div>
            </div>

            <div
              className={`achievement-item ${
                (progress.quizStats?.totalQuizzes || 0) >= 10 ? "unlocked" : ""
              }`}
            >
              <div className="achievement-icon">🎓</div>
              <div className="achievement-info">
                <h3>Quiz Champion</h3>
                <p>Complete 10 quizzes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
