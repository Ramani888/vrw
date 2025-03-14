"use client"

import Link from "next/link"
import { useCart } from "./cart-provider"
import { Button } from "@/components/ui/button"
import {
  ShoppingCart,
  Heart,
  User,
  Menu,
  Home,
  ShoppingBag,
  Grid3X3,
  Info,
  Phone,
  Package,
  LogOut,
  MapPin,
  Wallet,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { useMobile } from "@/hooks/use-mobile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function Header() {
  const { cart, wishlist } = useCart()
  const isMobile = useMobile()
  const [isOpen, setIsOpen] = useState(false)

  // Mock user data - in a real app, this would come from authentication context
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    walletBalance: 500,
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="w-full flex h-16 items-center justify-between px-4 md:px-6">
        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
              <div className="flex flex-col h-full">
                {/* User Profile Section */}
                <div className="p-6 bg-primary/5">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{user.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* Wallet Balance */}
                  <div className="mt-4 p-3 bg-background rounded-lg border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Wallet Balance</span>
                    </div>
                    <span className="font-bold">₹{user.walletBalance}</span>
                  </div>
                </div>

                <Separator />

                {/* Navigation Links */}
                <nav className="flex-1 overflow-auto py-4">
                  <div className="flex flex-col gap-1 px-2">
                    <Link
                      href="/"
                      className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      <Home className="h-5 w-5 text-primary" />
                      <span>Home</span>
                    </Link>

                    <Link
                      href="/shop"
                      className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      <ShoppingBag className="h-5 w-5 text-primary" />
                      <span>Shop</span>
                    </Link>

                    <Link
                      href="/categories"
                      className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      <Grid3X3 className="h-5 w-5 text-primary" />
                      <span>Categories</span>
                    </Link>

                    <Separator className="my-2" />

                    <div className="px-3 py-1 text-xs font-semibold text-muted-foreground">MY ACCOUNT</div>

                    <Link
                      href="/account"
                      className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-5 w-5 text-primary" />
                      <span>Profile</span>
                    </Link>

                    <Link
                      href="/account/orders"
                      className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      <Package className="h-5 w-5 text-primary" />
                      <span>My Orders</span>
                    </Link>

                    <Link
                      href="/account/wallet"
                      className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      <Wallet className="h-5 w-5 text-primary" />
                      <span>My Wallet</span>
                    </Link>

                    <Link
                      href="/wishlist"
                      className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      <Heart className="h-5 w-5 text-primary" />
                      <span>Wishlist</span>
                    </Link>

                    <Link
                      href="/account/addresses"
                      className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>Addresses</span>
                    </Link>

                    <Separator className="my-2" />

                    <Link
                      href="/about"
                      className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      <Info className="h-5 w-5 text-primary" />
                      <span>About Us</span>
                    </Link>

                    <Link
                      href="/contact"
                      className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      <Phone className="h-5 w-5 text-primary" />
                      <span>Contact Us</span>
                    </Link>
                  </div>
                </nav>

                <Separator />

                {/* Logout Button */}
                <div className="p-4">
                  <Button variant="outline" className="w-full justify-start" onClick={() => setIsOpen(false)}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            ShopEase
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:underline">
            Home
          </Link>
          <Link href="/shop" className="text-sm font-medium hover:underline">
            Shop
          </Link>
          <Link href="/categories" className="text-sm font-medium hover:underline">
            Categories
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm font-medium">
                Categories
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="/category/electronics" className="w-full">
                  Electronics
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/category/clothing" className="w-full">
                  Clothing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/category/home" className="w-full">
                  Home & Kitchen
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/category/beauty" className="w-full">
                  Beauty
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/about" className="text-sm font-medium hover:underline">
            About Us
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:underline">
            Contact Us
          </Link>
        </nav>

        {/* Cart, Wishlist, User */}
        <div className="flex items-center gap-4">
          <Link href="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {wishlist.length}
                </span>
              )}
              <span className="sr-only">Wishlist</span>
            </Button>
          </Link>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {cart.length}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="/account" className="w-full">
                  My Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/account/orders" className="w-full">
                  My Orders
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/account/wallet" className="w-full">
                  My Wallet
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/login" className="w-full">
                  Login
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/signup" className="w-full">
                  Sign Up
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

