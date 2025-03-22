"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { Separator } from "@/components/ui/separator"
import { set } from "zod"
import { serverGetCartData } from "@/services/serverApi"
import { useAuth } from "@/components/auth-provider"

export default function CartPage() {
  const { user } = useAuth();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
  const [loading, setLoading] = useState<boolean>(false);
  const [cartData, setCartData] = useState<any>(null);

  // Handle quantity change
  const handleQuantityChange = (id: string, newQuantity: number, size?: string | number, color?: string) => {
    if (newQuantity < 1) return
    updateQuantity(id, newQuantity, size, color)
    getCartData(true);
  }

  const getCartData = async (noLoading?: boolean) => {
    try {
      setLoading(noLoading ? false : true);
      const res = await serverGetCartData(String(user?._id?.toString()));
      setCartData(res?.data);
      setLoading(false);
    } catch (error) {
      setCartData(null);
      setLoading(false);
      console.error(error)
    }
  }

  useEffect(() => {
    if (user?._id) {
      getCartData();
    }
  }, [user])

  const totalDiscount = cartData?.data?.reduce((accumulator: any, item: any) => {
    const discount =
      item?.product?.mrp * item?.qty - item?.product?.price * item?.qty;
    return accumulator + discount;
  }, 0);

  const totalPrice = cartData?.data?.reduce((accumulator: any, item: any) => {
    return accumulator + item?.product?.mrp * item?.qty;
  }, 0);

  const extraDiscount = cartData?.data?.reduce((accumulator: any, item: any) => {
    const discountPercentage = parseFloat(item?.product?.discount) || 0;
    const priceDifference = item?.product?.mrp * item?.qty - totalDiscount;
    const discount =
      priceDifference > 0 ? (priceDifference * discountPercentage) / 100 : 0;

    return accumulator + discount;
  }, 0);

  const calculateTaxes = (data: any[]) => {
    return data?.map((item) => {
      if (item?.product?.gst) {
        const gstRate = parseFloat(item?.product?.gst) / 100;
        const gstAmount = item?.product?.price * gstRate;
        return {
          ...item?.product,
          gstAmount: gstAmount,
        };
      } else {
        const sgstRate = parseFloat(item?.product?.sgst) / 100 || 0;
        const igstRate = parseFloat(item?.product?.igst) / 100 || 0;
        const sgstAmount = item?.product?.price * sgstRate;
        const igstAmount = item?.product?.price * igstRate;
        return {
          ...item?.product,
          sgstAmount: sgstAmount,
          igstAmount: igstAmount,
        };
      }
    });
  };

  const calculateTotalGst = (data: any[]) => {
    return data?.reduce((total, item) => {
      const findProduct = cartData?.data?.find(
        (cardItem: any) => cardItem?.product?._id === item?._id
      );
      const gstAmount = parseFloat(item?.gstAmount) || 0;
      const qty = parseInt(findProduct?.qty, 10) || 0;
      return total + gstAmount * qty;
    }, 0);
  };

  const calculateTotalIgst = (data: any[]) => {
    return data?.reduce((total, item) => {
      const findProduct = cartData?.data?.find(
        (cardItem: any) => cardItem?.product?._id === item?._id
      );
      const igstAmount = parseFloat(item?.igstAmount) || 0;
      const qty = parseInt(findProduct?.qty, 10) || 0;
      return total + igstAmount * qty;
    }, 0);
  };

  const calculateTotalSgst = (data: any[]) => {
    return data?.reduce((total, item) => {
      const findProduct = cartData?.data?.find(
        (cardItem: any) => cardItem?.product?._id === item?._id
      );
      const sgstAmount = parseFloat(item?.sgstAmount) || 0;
      const qty = parseInt(findProduct?.qty, 10) || 0;
      return total + sgstAmount * qty;
    }, 0);
  };

  const gstData = calculateTaxes(cartData?.data);

  const totalGst = calculateTotalGst(gstData);
  const totalIgst = calculateTotalIgst(gstData);
  const totalSgst = calculateTotalSgst(gstData);

  const total =
    totalPrice -
    Math.round(extraDiscount) -
    totalDiscount +
    (Math.round(totalGst) !== 0
      ? Math.round(totalGst)
      : Math.round(totalIgst) + Math.round(totalSgst));

  if (loading) {
    return <CartPageSkeleton />
  }

  return (
    <div className="w-full px-4 py-8 md:px-6 md:py-12">
      <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>

      {cartData?.data?.length === 0 ? (
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
                  {cartData?.data?.map((item: any, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="relative h-24 w-24 overflow-hidden rounded-md border">
                        <Image src={item?.product?.image?.[0]?.path || "/placeholder.svg"} alt={item?.product?.name} fill className="object-cover" />
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <Link href={`/product/${item?.product?._id}`} className="font-medium hover:underline">
                            {item?.product?._id}
                          </Link>
                          {/* Display size and color if available */}
                          {(item?.product?.size || item?.product?.color) && (
                            <div className="mt-1 text-sm text-muted-foreground">
                              {item?.product?.color && <span>Color: {item?.product?.color}</span>}
                              {item?.product?.color && item?.product?.size && <span> | </span>}
                              {item?.product?.size && <span>Size: {item?.product?.size[0]}</span>}
                            </div>
                          )}
                          <div className="mt-1 flex items-center gap-2">
                            <span className="font-medium">₹{item?.product?.price?.toLocaleString()}</span>
                            {item?.product?.mrp > item?.product?.price && (
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{item?.product?.mrp.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center border rounded-md">
                            <button
                              className="px-3 py-1 text-lg"
                              onClick={() => handleQuantityChange(item?.product?._id, item?.qty - 1, item?.product?.size?.[0], item?.product?.color)}
                            >
                              -
                            </button>
                            <span className="px-3 py-1 border-x">{item?.qty}</span>
                            <button
                              className="px-3 py-1 text-lg"
                              onClick={() => handleQuantityChange(item?.product?._id, item?.qty - 1, item?.product?.size?.[0], item?.product?.color)}
                            >
                              +
                            </button>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item?.product?._id, item?.product?.size?.[0], item?.product?.color)}
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
                    <span>₹{totalPrice?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{totalDiscount?.toLocaleString()}</span>
                  </div>
                  {Math.round(extraDiscount) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Extra Discount</span>
                      <span>-₹{Math.round(extraDiscount).toLocaleString()}</span>
                    </div>
                  )}
                  {Math.round(totalGst) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>GST</span>
                      <span>₹{Math.round(totalGst).toLocaleString()}</span>
                    </div>
                  )}
                  {Math.round(totalIgst) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>IGST</span>
                      <span>₹{Math.round(totalIgst).toLocaleString()}</span>
                    </div>
                  )}
                  {Math.round(totalSgst) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>SGST</span>
                      <span>₹{Math.round(totalSgst).toLocaleString()}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <Link href="/checkout">
                  <Button className="mt-6 w-full">Proceed to Checkout</Button>
                </Link>

                {/* <div className="mt-4 text-center text-sm text-muted-foreground">
                  <p>Free shipping on orders over ₹500</p>
                </div> */}
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