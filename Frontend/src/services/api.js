import axios from "axios"

const API_BASE_URL = "http://localhost:5000"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // If the error is 401 and we haven't already tried to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refreshToken")
        if (!refreshToken) {
          throw new Error("No refresh token available")
        }

        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, null, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        })

        const { accessToken } = response.data
        localStorage.setItem("token", accessToken)

        // Retry the original request with the new token
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // If refresh token fails, redirect to login
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

// Auth services
export const authService = {
  login: async (username, password) => {
    const response = await api.post("/api/auth/authenticate", { username, password })
    return response.data
  },
  register: async (username, password) => {
    const response = await api.post("/api/auth/register", { username, password })
    return response.data
  },
  refreshToken: async (refreshToken) => {
    const response = await api.post("/api/auth/refresh", null, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    })
    return response.data
  },
  logout: async () => {
    try {
      await api.post("/api/auth/logout")
    } catch (err) {
      console.error("Logout error", err)
    } finally {
      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
    }
  },
  getStreakInfo: async () => {
    const response = await api.get("/api/auth/streak")
    return response.data
  },
  getUserInfo: async () => {
    const response = await api.get("/api/auth/user")
    return response.data
  },
}

// GPT services
export const gptService = {
  generateQuestion: async (topic) => {
    const response = await api.get(`/api/gpt/generate?topic=${encodeURIComponent(topic)}`)
    return response.data
  },
  generateMultipleQuestions: async (topic, count) => {
    const response = await api.get(`/api/gpt/generateMultipleQuestions?topic=${topic}&count=${count}`)
    return response.data
  },
  withCredentials:true
}

// Question services
export const questionService = {
  storeQuestions: async (topic, count) => {
    const response = await api.post(`/api/questions/store?topic=${encodeURIComponent(topic)}&count=${count}`)
    return response.data
  },
  getRandomQuestions: async (count) => {
    const response = await api.get(`/api/questions/random?count=${count}`)
    return response.data
  },
}

// Quiz services
export const quizService = {
  createQuiz: async (questionCount) => {
    const response = await api.post(`/api/quiz/create?questionCount=${questionCount}`)
    return response.data
  },
  submitQuiz: async (quizId, answers) => {
    const response = await api.post(`/api/quiz/${quizId}/submit`, answers)
    return response.data
  },
  getQuizHistory: async () => {
    const response = await api.get("/api/quiz/history")
    return response.data
  },
  getQuiz: async (quizId) => {
    const response = await api.get(`/api/quiz/${quizId}`)
    return response.data
  },
}

export default api
