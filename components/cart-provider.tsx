"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type CartItem = {
  id: string
  name: string
  price: number
  mrp: number
  image: string
  quantity: number
}

type WishlistItem = {
  id: string
  name: string
  price: number
  mrp: number
  image: string
}

type CartContextType = {
  cart: CartItem[]
  wishlist: WishlistItem[]
  addToCart: (product: Omit<CartItem, "quantity">) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  addToWishlist: (product: WishlistItem) => void
  removeFromWishlist: (id: string) => void
  isInWishlist: (id: string) => boolean
  isInCart: (id: string) => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])

  // Load cart and wishlist from localStorage on client side
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    const savedWishlist = localStorage.getItem("wishlist")

    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist))
  }, [])

  // Save cart and wishlist to localStorage when they change
  useEffect(() => {
    if (cart.length > 0) localStorage.setItem("cart", JSON.stringify(cart))
    if (cart.length === 0) localStorage.removeItem("cart")

    if (wishlist.length > 0) localStorage.setItem("wishlist", JSON.stringify(wishlist))
    if (wishlist.length === 0) localStorage.removeItem("wishlist")
  }, [cart, wishlist])

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem("cart")
  }

  const addToWishlist = (product: WishlistItem) => {
    setWishlist((prevWishlist) => {
      const existingItem = prevWishlist.find((item) => item.id === product.id)
      if (existingItem) return prevWishlist
      return [...prevWishlist, product]
    })
  }

  const removeFromWishlist = (id: string) => {
    setWishlist((prevWishlist) => prevWishlist.filter((item) => item.id !== id))
  }

  const isInWishlist = (id: string) => {
    return wishlist.some((item) => item.id === id)
  }

  const isInCart = (id: string) => {
    return cart.some((item) => item.id === id)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

