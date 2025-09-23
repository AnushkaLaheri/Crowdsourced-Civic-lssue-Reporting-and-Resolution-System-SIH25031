"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "../lib/firebase"

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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user role from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
        const userData = userDoc.data()
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: userData?.name || firebaseUser.displayName,
          role: userData?.role || "citizen",
          ward: userData?.ward,
          phone: userData?.phone,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (credentials) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password)
      const firebaseUser = userCredential.user

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
      const userData = userDoc.data()

      const userInfo = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: userData?.name || firebaseUser.displayName,
        role: userData?.role || "citizen",
        ward: userData?.ward,
        phone: userData?.phone,
      }

      setUser(userInfo)
      return { success: true, user: userInfo }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const signup = async (userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password)
      const firebaseUser = userCredential.user

      // Store user data in Firestore
      await setDoc(doc(db, "users", firebaseUser.uid), {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        ward: userData.ward,
        role: userData.role || "citizen",
      })

      const newUser = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: userData.name,
        role: userData.role || "citizen",
        ward: userData.ward,
        phone: userData.phone,
      }

      setUser(newUser)
      return { success: true, user: newUser }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
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
