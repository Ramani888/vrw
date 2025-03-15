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
  size?: string | number
  color?: string
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
  removeFromCart: (id: string, size?: string | number, color?: string) => void
  updateQuantity: (id: string, quantity: number, size?: string | number, color?: string) => void
  clearCart: () => void
  addToWishlist: (product: WishlistItem) => void
  removeFromWishlist: (id: string) => void
  isInWishlist: (id: string) => boolean
  isInCart: (id: string, size?: string | number, color?: string) => boolean
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
      // For products with size/color, we need to check if the exact same product (with same size/color) exists
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.size === product.size && item.color === product.color,
      )

      if (existingItemIndex !== -1) {
        // If the exact same product exists, increase its quantity
        return prevCart.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        // Otherwise add as a new item
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (id: string, size?: string | number, color?: string) => {
    if (size || color) {
      // If size or color is provided, remove only the specific variant
      setCart((prevCart) => prevCart.filter((item) => !(item.id === id && item.size === size && item.color === color)))
    } else {
      // Otherwise remove all items with the given id
      setCart((prevCart) => prevCart.filter((item) => item.id !== id))
    }
  }

  const updateQuantity = (id: string, quantity: number, size?: string | number, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, size, color)
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        // Update quantity only for the specific variant if size or color is provided
        if (size || color) {
          if (item.id === id && item.size === size && item.color === color) {
            return { ...item, quantity }
          }
          return item
        }

        // Otherwise update all items with the given id
        return item.id === id ? { ...item, quantity } : item
      }),
    )
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

  const isInCart = (id: string, size?: string | number, color?: string) => {
    if (size || color) {
      // Check if the specific variant is in cart
      return cart.some((item) => item.id === id && item.size === size && item.color === color)
    }
    // Otherwise check if any variant of the product is in cart
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