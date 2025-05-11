"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "@/components/auth-provider"
import { serverAddToCart, serverAddWishlistProduct, serverGetCartData, serverGetWishlistProduct, serverRemoveToCart, serverRemoveWishlistProduct, serverUpdateCartData } from "@/services/serverApi"
import { set } from "zod"

// export type CartItem = {
//   id: string
//   name: string
//   price: number
//   mrp: number
//   image: string
//   quantity: number
//   size?: string | number
//   color?: string
// }

// export type WishlistItem = {
//   id: string
//   name: string
//   price: number
//   mrp: number
//   image: string
// }

type CartContextType = {
  cartData: any
  cart: any[]
  wishlist: any[]
  addToCart: (product: any) => void
  removeFromCart: (id: string, size?: string | number, color?: string) => void
  updateQuantity: (id: string, quantity: number, size?: string | number, color?: string) => void
  clearCart: () => void
  addToWishlist: (product: any) => void
  removeFromWishlist: (id: string) => void
  isInWishlist: (id: string) => boolean
  isInCart: (id: string) => boolean
  loading: boolean
  error: string | null
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, showLoginDialog, user } = useAuth()
  const [cart, setCart] = useState<any[]>([])
  const [cartData, setCartData] = useState<any>(null)
  const [wishlist, setWishlist] = useState<any[]>([])
  const [pendingAction, setPendingAction] = useState<{
    type: "cart" | "wishlist"
    product: any
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load cart and wishlist when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCartAndWishlist()
    } else {
      // Clear cart and wishlist when logged out
      setCart([])
      setWishlist([])
      setCartData(null)
    }
  }, [isAuthenticated])

  const loadCartAndWishlist = async () => {
    if (!isAuthenticated) return
    
    setLoading(true)
    setError(null)
    
    try {
      const cartRes = await serverGetCartData(String(user?._id));
      const wishlistRes = await serverGetWishlistProduct(String(user?._id?.toString()));
      setCart(cartRes?.data?.data)
      setCartData(cartRes?.data)
      setWishlist(wishlistRes?.data)
    } catch (err) {
      console.error("Failed to load cart or wishlist:", err)
      setError("Failed to load your cart and wishlist. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Execute pending action after authentication
  useEffect(() => {
    if (isAuthenticated && pendingAction) {
      if (pendingAction.type === "cart") {
        addToCart(pendingAction.product)
      } else if (pendingAction.type === "wishlist") {
        addToWishlist(pendingAction.product)
      }
      setPendingAction(null)
    }
  }, [isAuthenticated, pendingAction])

  const addToCart = async (product: any) => {
    if (!isAuthenticated) {
      // Save pending action and show login dialog
      setPendingAction({
        type: "cart",
        product,
      })
      showLoginDialog()
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const bodyData = {
        userId: user?._id?.toString(),
        productId: product?._id?.toString(),
        qty: product?.quantity || 1,
      }
      await serverAddToCart(bodyData);
      loadCartAndWishlist();
    } catch (err) {
      console.error("Failed to add item to cart:", err)
      setError("Failed to add item to cart. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (id: string) => {
    if (!isAuthenticated) return
    
    setLoading(true)
    setError(null)
    
    try {
      await serverRemoveToCart(String(user?._id?.toString()), id);
      loadCartAndWishlist();
    } catch (err) {
      console.error("Failed to remove item from cart:", err)
      setError("Failed to remove item from cart. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (id: string, quantity: number) => {
    if (!isAuthenticated) return
    
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const bodyData = {
        qty: quantity,
        productId: id,
        userId: String(user?._id?.toString())
      }
      await serverUpdateCartData(bodyData);
      loadCartAndWishlist();
    } catch (err) {
      console.error("Failed to update item quantity:", err)
      setError("Failed to update item quantity. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    if (!isAuthenticated) return
    
    setLoading(true)
    setError(null)
    
    try {
      cart?.forEach(async (item: any) => {
        await serverRemoveToCart(String(user?._id?.toString()), item?.productId);
      });
      loadCartAndWishlist();
    } catch (err) {
      console.error("Failed to clear cart:", err)
      setError("Failed to clear your cart. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const addToWishlist = async (product: any) => {
    if (!isAuthenticated) {
      // Save pending action and show login dialog
      setPendingAction({
        type: "wishlist",
        product,
      })
      showLoginDialog()
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const bodyData = {
        userId: user?._id?.toString(),
        productId: product?._id?.toString()
      }
      await serverAddWishlistProduct(bodyData);
      loadCartAndWishlist();
    } catch (err) {
      console.error("Failed to add item to wishlist:", err)
      setError("Failed to add item to wishlist. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (id: string) => {
    if (!isAuthenticated) return
    
    setLoading(true)
    setError(null)
    
    try {
      await serverRemoveWishlistProduct(String(user?._id?.toString()), id);
      loadCartAndWishlist();
    } catch (err) {
      console.error("Failed to remove item from wishlist:", err)
      setError("Failed to remove item from wishlist. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const isInWishlist = (id: string) => {
    return Array.isArray(wishlist) && wishlist.some((item) => item?.id === id)
  }

  const isInCart = (id: string) => {
    return Array.isArray(cart) && cart.some((item) => item?.id === id)
  }

  return (
    <CartContext.Provider
      value={{
        cartData,
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
        loading,
        error
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