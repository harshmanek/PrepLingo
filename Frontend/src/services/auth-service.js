import api from "./api"

export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post("/api/auth/authenticate", { username, password })

      // Store tokens in localStorage
      localStorage.setItem("token", response.data.accessToken)
      localStorage.setItem("refreshToken", response.data.refreshToken)

      return response.data
    } catch (error) {
      console.error("Login error:", error)
      throw error.response?.data || "Login failed"
    }
  },

  register: async (username, password) => {
    try {
      const response = await api.post("/api/auth/register", { username, password })
      return response.data
    } catch (error) {
      console.error("Registration error:", error)
      throw error.response?.data?.error || "Registration failed"
    }
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem("refreshToken")
    if (!refreshToken) {
      throw new Error("No refresh token available")
    }

    try {
      const response = await api.post("/api/auth/refresh", null, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      })

      localStorage.setItem("token", response.data.accessToken)
      return response.data
    } catch (error) {
      console.error("Token refresh error:", error)
      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
      throw error
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        await api.post("/api/auth/logout", null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
    }
  },

  getStreakInfo: async () => {
    try {
      const response = await api.get("/api/auth/user")
      return {
        streakCount: response.data.streakCount || 0,
        lastStreakDate: response.data.lastStreakDate,
        maintainedToday: response.data.maintainedTodayStreak || false,
      }
    } catch (error) {
      console.error("Error fetching streak info:", error)
      // Return default values on error
      return {
        streakCount: 0,
        lastStreakDate: null,
        maintainedToday: false,
      }
    }
  },

  getUserInfo: async () => {
    try {
      const response = await api.get("/api/auth/user")
      return response.data
    } catch (error) {
      console.error("Error fetching user info:", error)
      throw error
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token")
  },
}
