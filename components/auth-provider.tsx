"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import LoginDialog from "@/components/login-dialog"

type User = {
  _id: string
  name: string
  email: string
  mobileNumber: string
} | null

type AuthContextType = {
  user: User
  isLoading: boolean
  isAuthenticated: boolean
  login: (userData: User) => void
  logout: () => void
  showLoginDialog: (redirectUrl?: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Public routes that don't require authentication
const publicRoutes = [
  "/", "/shop", "/categories", "/category", "/product",
  "/about", "/contact", "/login", "/signup"
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState<string | undefined>(undefined)
  const router = useRouter()
  const pathname = usePathname()

  // Check if the current path is a public route
  const isPublicRoute = (path: string) => {
    return publicRoutes.some((route) => path === route || path.startsWith(`${route}/`))
  }

  // Check authentication from localStorage
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        } else if (!isPublicRoute(pathname)) {
          showLoginDialog(pathname)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname])

  // Login function (stores user in localStorage)
  const login = (userData: User) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
    }
  }

  // Logout function (removes user from localStorage)
  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")
  }

  // Show login dialog
  const showLoginDialog = (redirectTo?: string) => {
    setRedirectUrl(redirectTo)
    setIsLoginDialogOpen(true)
  }

  // Handle successful login
  const handleLoginSuccess = (userData: User) => {
    login(userData)
    setIsLoginDialogOpen(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        showLoginDialog,
      }}
    >
      {children}
      <LoginDialog
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
        onSuccess={handleLoginSuccess}
        redirectUrl={redirectUrl}
      />
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}