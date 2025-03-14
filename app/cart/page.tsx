"use client"
import Image from "next/image"
import Link from "next/link"
import { Trash, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { Separator } from "@/components/ui/separator"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()

  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  // Calculate discount
  const discount = cart.reduce((total, item) => total + (item.mrp - item.price) * item.quantity, 0)

  // Calculate shipping (free over ₹500)
  const shipping = subtotal > 500 ? 0 : 50

  // Calculate total
  const total = subtotal + shipping

  // Handle quantity change
  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(id, newQuantity)
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
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-24 w-24 overflow-hidden rounded-md border">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <Link href={`/product/${item.id}`} className="font-medium hover:underline">
                            {item.name}
                          </Link>
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
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span className="px-3 py-1 border-x">{item.quantity}</span>
                            <button
                              className="px-3 py-1 text-lg"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>

                          <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
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

