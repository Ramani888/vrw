"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import LoginDialog from "@/components/login-dialog"

type User = {
  id: string
  name: string
  email: string
  mobile: string
} | null

type AuthContextType = {
  user: User
  isLoading: boolean
  isAuthenticated: boolean
  login: () => void
  logout: () => void
  showLoginDialog: (redirectUrl?: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Public routes that don't require authentication
const publicRoutes = [
  "/", // Home
  "/shop", // Shop
  "/categories", // Categories
  "/category", // Category pages (with any slug)
  "/product", // Product pages (with any ID)
  "/about", // About Us
  "/contact", // Contact Us
  "/login", // Login
  "/signup", // Sign Up
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
    return publicRoutes.some((route) => {
      // Exact match for routes like '/', '/login', etc.
      if (route === path) return true

      // Prefix match for routes like '/category/electronics', '/product/123', etc.
      if (path.startsWith(`${route}/`)) return true

      return false
    })
  }

  // Check if the user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if auth token exists in cookies
        const hasAuthToken = document.cookie.includes("auth-token=")

        if (hasAuthToken) {
          // In a real app, you would fetch the user data from your API
          // For demo purposes, we'll set a mock user
          setUser({
            id: "1",
            name: "John Doe",
            email: "john.doe@example.com",
            mobile: "9876543210",
          })
        } else if (!isPublicRoute(pathname)) {
          // If not authenticated and trying to access a protected route,
          // show the login dialog and save the current URL for redirection
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

  // Login function
  const login = () => {
    // In a real app, this would be handled by the login form
    // For demo purposes, we're just setting the user directly
    setUser({
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      mobile: "9876543210",
    })
  }

  // Logout function
  const logout = () => {
    // Remove auth token from cookies
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax"

    // Clear user data
    setUser(null)

    // Redirect to home page
    router.push("/")
  }

  // Show login dialog
  const showLoginDialog = (redirectTo?: string) => {
    setRedirectUrl(redirectTo)
    setIsLoginDialogOpen(true)
  }

  // Handle successful login
  const handleLoginSuccess = () => {
    login()
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
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
