"use client"

import Link from "next/link"
import { useCart } from "./cart-provider"
import { useAuth } from "./auth-provider"
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
import { useEffect, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import useShop from "@/hooks/useShop"
import logo from "../public/logo.jpeg";
import { serverGetRewardData } from "@/services/serverApi"
import { usePathname, useRouter } from "next/navigation"

export default function Header() {
  const { cart, wishlist } = useCart()
  const { user, isAuthenticated, logout, showLoginDialog } = useAuth()
  console.log('isAuthenticated:', isAuthenticated)
  const isMobile = useMobile()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true);
  const [rewardData, setRewardData] = useState<any>(null);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleLoginClick = () => {
    if (pathname !== "/login") {
      showLoginDialog()
    }
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/categories", label: "Categories" },
    // { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
    // { href: "/terms-conditions", label: "Terms & Conditions" },
    // { href: "/privacy-policy", label: "Privacy Policy" },
    // { href: "/return-refund-cancellation-policy", label: "Return/Refund/Cancellation Policy" },
    // { href: "/shipping-policy", label: "Shipping Policy" },
  ]

  const {
    categoryData
  } = useShop();

  const getRewardData = async () => {
    try {
      setLoading(true);
      const res = await serverGetRewardData(String(user?._id?.toString()));
      setRewardData(res?.data);
    } catch (err) {
      console.error("Error fetching reward data:", err);
      setRewardData(null);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    if (user?._id) {
      getRewardData();
    }
  }, [user]);

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
                  {isAuthenticated ? (
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt={user?.name} />
                        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{user?.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <h3 className="font-medium">Welcome to ShopEase</h3>
                      <Button onClick={handleLoginClick}>Sign In</Button>
                    </div>
                  )}

                  {/* Wallet Balance */}
                  {isAuthenticated && (
                    <div className="mt-4 p-3 bg-background rounded-lg border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">Wallet Balance</span>
                      </div>
                      <span className="font-bold">₹{rewardData?.remainingReward || 0}</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Navigation Links */}
                <nav className="flex-1 overflow-auto py-4">
                  <div className="flex flex-col gap-1 px-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.href === "/" && <Home className="h-5 w-5 text-primary" />}
                        {link.href === "/shop" && <ShoppingBag className="h-5 w-5 text-primary" />}
                        {link.href === "/categories" && <Grid3X3 className="h-5 w-5 text-primary" />}
                        {/* {link.href === "/about" && <Info className="h-5 w-5 text-primary" />} */}
                        {link.href === "/contact" && <Phone className="h-5 w-5 text-primary" />}
                        <span>{link.label}</span>
                      </Link>
                    ))}

                    <Separator className="my-2" />

                    {isAuthenticated && (
                      <>
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

                        <Button
                          variant="ghost"
                          className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent w-full justify-start"
                          onClick={() => {
                            logout()
                            setIsOpen(false)
                          }}
                        >
                          <LogOut className="h-5 w-5 text-primary" />
                          <span>Logout</span>
                        </Button>
                      </>
                    )}
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            {!isMobile && (
              <Image src={logo} alt="Logo" width={50} height={50} />
            )}
            VR Fashion
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium hover:underline">
              {link.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="text-sm font-medium" style={{ cursor: "pointer" }}>
                Categories
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {categoryData?.map((item: any) => {
                return (
                  <DropdownMenuItem key={item?._id}>
                    <Link href={`/category/${item?._id}`} className="w-full">
                      {item?.name}
                    </Link>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Cart, Wishlist, User */}
        <div className="flex items-center gap-4">
          <Link href={isAuthenticated ? "/wishlist" : "/login"}>
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

          <Link href={isAuthenticated ? "/cart" : "/login"}>
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

          {isAuthenticated ? (
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
                  <Link href="/terms-conditions" className="w-full">
                    Terms & Condition
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/privacy-policy" className="w-full">
                    Privacy Policy
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/return-refund-cancellation-policy" className="w-full">
                    Return/Refund/Cancellation Policy
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/shipping-policy" className="w-full">
                    Shipping Policy
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <span className="w-full">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" onClick={handleLoginClick}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}