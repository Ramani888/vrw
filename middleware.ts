import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

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

export function middleware(request: NextRequest) {
  // Get the path from the request URL
  const path = request.nextUrl.pathname

  // Check if the user is authenticated by looking for the auth token in cookies
  const isAuthenticated = request.cookies.has("auth-token")

  // Check if the current path is a public route or starts with a public route prefix
  const isPublicRoute = publicRoutes.some((route) => {
    // Exact match for routes like '/', '/login', etc.
    if (route === path) return true

    // Prefix match for routes like '/category/electronics', '/product/123', etc.
    if (path.startsWith(`${route}/`)) return true

    return false
  })

  // If the user is not authenticated and trying to access a non-public route
  if (!isAuthenticated && !isPublicRoute) {
    // Create a URL to redirect to the login page
    const loginUrl = new URL("/login", request.url)

    // Add the original URL as a redirect parameter
    // loginUrl.searchParams.set("redirect", path)

    // Redirect to the login page
    return NextResponse.redirect(loginUrl)
  }

  // If the user is authenticated and trying to access login or signup pages
  if (isAuthenticated && (path === "/login" || path === "/signup")) {
    // Redirect to the home page
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Allow the request to proceed
  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  // Match all routes except for static files, api routes, and _next
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
}

