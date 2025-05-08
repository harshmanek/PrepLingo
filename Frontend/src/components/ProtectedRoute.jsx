"use client"

import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import LoadingSpinner from "./LoadingSpinner"

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext)

  if (loading) {
    return <LoadingSpinner />
  }

  if (!currentUser) {
    return <Navigate to="/login" />
  }

  return children
}

export default ProtectedRoute
