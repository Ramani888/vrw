"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, ShoppingBag } from "lucide-react"
import { Suspense, useEffect, useState } from "react"

function CheckoutSuccessForm() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId") || "ORD12345"
  const paymentMethod = searchParams.get("paymentMethod") || "Credit Card"
  const paymentId = searchParams.get("paymentId")

  const [orderDate, setOrderDate] = useState("")

  useEffect(() => {
    setOrderDate(new Date().toLocaleDateString())
  }, [])

  return (
    <div className="container flex flex-col items-center justify-center px-4 py-12 md:py-24">
      <div className="mx-auto max-w-md text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />

        <h1 className="mt-6 text-3xl font-bold">Order Placed Successfully!</h1>

        <p className="mt-4 text-muted-foreground">
          Thank you for your purchase. Your order has been placed successfully and will be processed soon.
        </p>

        <div className="mt-8 rounded-lg border p-6 text-left">
          <h2 className="text-xl font-medium">Order Details</h2>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Number:</span>
              <span className="font-medium">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{orderDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="font-medium">{paymentMethod}</span>
            </div>
            {paymentId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment ID:</span>
                <span className="font-medium">{paymentId}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping Address:</span>
              <span className="font-medium text-right">123 Main St, Anytown</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/shop">
            <Button className="w-full sm:w-auto">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
          <Link href="/account/orders">
            <Button variant="outline" className="w-full sm:w-auto">
              View My Orders
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutSuccessForm />
    </Suspense>
  )
}

