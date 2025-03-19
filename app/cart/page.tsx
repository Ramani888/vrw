"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { Separator } from "@/components/ui/separator"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
  const [loading, setLoading] = useState(true)

  // Simulate loading cart data from API
  useEffect(() => {
    const fetchCartData = async () => {
      // In a real app, you might fetch additional cart data from an API
      // For example, checking stock availability, updated prices, etc.

      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1200))

      setLoading(false)
    }

    fetchCartData()
  }, [])

  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  // Calculate discount
  const discount = cart.reduce((total, item) => total + (item.mrp - item.price) * item.quantity, 0)

  // Calculate shipping (free over ₹500)
  const shipping = subtotal > 500 ? 0 : 50

  // Calculate total
  const total = subtotal + shipping

  // Handle quantity change
  const handleQuantityChange = (id: string, newQuantity: number, size?: string | number, color?: string) => {
    if (newQuantity < 1) return
    updateQuantity(id, newQuantity, size, color)
  }

  if (loading) {
    return <CartPageSkeleton />
  }

  return (
    <div className="w-full px-4 py-8 md:px-6 md:py-12">
      <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <ShoppingBag className="h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-medium">Your cart is empty</h2>
          <p className="mt-2 text-center text-muted-foreground">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link href="/shop">
            <Button className="mt-6">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-medium">Shopping Cart ({cart.length})</h2>
                  <Button variant="ghost" size="sm" onClick={clearCart}>
                    Clear Cart
                  </Button>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <div key={`${item.id}-${item?.size}-${item?.color}-${index}`} className="flex gap-4">
                      <div className="relative h-24 w-24 overflow-hidden rounded-md border">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <Link href={`/product/${item.id}`} className="font-medium hover:underline">
                            {item.name}
                          </Link>
                          {/* Display size and color if available */}
                          {(item?.size || item?.color) && (
                            <div className="mt-1 text-sm text-muted-foreground">
                              {item?.color && <span>Color: {item?.color}</span>}
                              {item?.color && item?.size && <span> | </span>}
                              {item?.size && <span>Size: {item?.size}</span>}
                            </div>
                          )}
                          <div className="mt-1 flex items-center gap-2">
                            <span className="font-medium">₹{item.price.toLocaleString()}</span>
                            {item.mrp > item.price && (
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{item.mrp.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center border rounded-md">
                            <button
                              className="px-3 py-1 text-lg"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.size, item.color)}
                            >
                              -
                            </button>
                            <span className="px-3 py-1 border-x">{item.quantity}</span>
                            <button
                              className="px-3 py-1 text-lg"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.size, item.color)}
                            >
                              +
                            </button>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.id, item.size, item.color)}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="rounded-lg border">
              <div className="p-6">
                <h2 className="text-xl font-medium">Order Summary</h2>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <Link href="/checkout">
                  <Button className="mt-6 w-full">Proceed to Checkout</Button>
                </Link>

                <div className="mt-4 text-center text-sm text-muted-foreground">
                  <p>Free shipping on orders over ₹500</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Cart Page Skeleton
function CartPageSkeleton() {
  return (
    <div className="w-full px-4 py-8 md:px-6 md:py-12">
      <div className="h-10 w-48 rounded-md bg-muted animate-pulse mb-8" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart Items Skeleton */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-8 w-40 rounded-md bg-muted animate-pulse" />
              <div className="h-8 w-24 rounded-md bg-muted animate-pulse" />
            </div>

            <div className="h-0.5 w-full bg-muted animate-pulse my-4" />

            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-24 w-24 rounded-md bg-muted animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-6 w-3/4 rounded-md bg-muted animate-pulse" />
                    <div className="h-4 w-1/2 rounded-md bg-muted animate-pulse" />
                    <div className="h-4 w-1/3 rounded-md bg-muted animate-pulse" />
                    <div className="flex items-center justify-between">
                      <div className="h-8 w-24 rounded-md bg-muted animate-pulse" />
                      <div className="h-8 w-8 rounded-md bg-muted animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary Skeleton */}
        <div>
          <div className="rounded-lg border p-6">
            <div className="h-8 w-40 rounded-md bg-muted animate-pulse mb-4" />

            <div className="h-0.5 w-full bg-muted animate-pulse my-4" />

            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-5 w-24 rounded-md bg-muted animate-pulse" />
                  <div className="h-5 w-16 rounded-md bg-muted animate-pulse" />
                </div>
              ))}

              <div className="h-0.5 w-full bg-muted animate-pulse my-2" />

              <div className="flex justify-between">
                <div className="h-6 w-16 rounded-md bg-muted animate-pulse" />
                <div className="h-6 w-20 rounded-md bg-muted animate-pulse" />
              </div>
            </div>

            <div className="h-10 w-full rounded-md bg-muted animate-pulse mt-6" />

            <div className="h-4 w-48 mx-auto rounded-md bg-muted animate-pulse mt-4" />
          </div>
        </div>
      </div>
    </div>
  )
}