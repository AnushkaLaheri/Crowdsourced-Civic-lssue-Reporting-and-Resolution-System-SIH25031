"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    // Mock login API call
    try {
      const mockUser = {
        id: "1",
        name: credentials.email === "admin@civic.gov" ? "Admin User" : "John Doe",
        email: credentials.email,
        role:
          credentials.email === "admin@civic.gov"
            ? "admin"
            : credentials.email === "staff@civic.gov"
              ? "staff"
              : "citizen",
        ward: "Ward 12",
        phone: "+91 9876543210",
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      return { success: true, user: mockUser }
    } catch (error) {
      return { success: false, error: "Login failed" }
    }
  }

  const signup = async (userData) => {
    // Mock signup API call
    try {
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        role: userData.role || "citizen",
      }

      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
      return { success: true, user: newUser }
    } catch (error) {
      return { success: false, error: "Signup failed" }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
