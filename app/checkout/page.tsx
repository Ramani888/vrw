"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CreditCard, Wallet, Truck, ShieldCheck, ArrowLeft, Check, MapPin, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock addresses data - in a real app, this would come from an API or context
const initialAddresses = [
  {
    id: "1",
    name: "John Doe",
    phone: "+1 (123) 456-7890",
    addressLine1: "123 Main Street",
    addressLine2: "Apt 4B",
    city: "New York",
    state: "NY",
    pincode: "10001",
    type: "home",
    isDefault: true,
  },
  {
    id: "2",
    name: "John Doe",
    phone: "+1 (123) 456-7890",
    addressLine1: "456 Office Plaza",
    addressLine2: "Suite 200",
    city: "New York",
    state: "NY",
    pincode: "10002",
    type: "work",
    isDefault: false,
  },
]

// Mock wallet balance
const walletBalance = 500

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [addresses, setAddresses] = useState(initialAddresses)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [useWalletBalance, setUseWalletBalance] = useState(false)
  const [appliedWalletAmount, setAppliedWalletAmount] = useState(0)

  // Load addresses from localStorage on client side
  useEffect(() => {
    const savedAddresses = localStorage.getItem("addresses");
    if (savedAddresses) {
      const parsedAddresses = JSON.parse(savedAddresses);
      setAddresses(parsedAddresses);
  
      // Set default address as selected
      const defaultAddress = parsedAddresses.find((addr: any) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else if (parsedAddresses.length > 0) {
        setSelectedAddressId(parsedAddresses[0].id);
      }
    }
  }, []);

  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  // Calculate discount
  const discount = cart.reduce((total, item) => total + (item.mrp - item.price) * item.quantity, 0)

  // Calculate shipping (free over ₹500)
  const shipping = subtotal > 500 ? 0 : 50

  // Calculate total before wallet
  const totalBeforeWallet = subtotal + shipping

  // Calculate wallet amount to apply
  useEffect(() => {
    if (useWalletBalance && totalBeforeWallet > 200) {
      // Apply wallet balance, but don't exceed the total or available balance
      const maxApplicable = Math.min(walletBalance, totalBeforeWallet)
      setAppliedWalletAmount(maxApplicable)
    } else {
      setAppliedWalletAmount(0)
    }
  }, [useWalletBalance, totalBeforeWallet])

  // Calculate final total
  const total = totalBeforeWallet - appliedWalletAmount

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 1) {
      if (!selectedAddressId) {
        alert("Please select a delivery address")
        return
      }
      setStep(2)
    } else {
      // Process payment and redirect to success page
      clearCart()
      router.push("/checkout/success")
    }
  }

  // If cart is empty, redirect to cart page
  if (cart.length === 0) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-xl font-medium">Your cart is empty</h2>
          <p className="mt-2 text-center text-muted-foreground">
            Add some items to your cart before proceeding to checkout.
          </p>
          <Link href="/shop">
            <Button className="mt-6">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8">
        <Link
          href="/cart"
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Link>
      </div>

      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Checkout Steps */}
        <div className="lg:col-span-2">
          <div className="mb-6 flex">
            <div className="flex flex-1 flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                {step > 1 ? <Check className="h-4 w-4" /> : 1}
              </div>
              <span className="mt-2 text-sm font-medium">Shipping</span>
            </div>
            <div className="relative flex flex-1 items-center justify-center">
              <div className={`absolute h-0.5 w-full ${step > 1 ? "bg-primary" : "bg-muted"}`} />
            </div>
            <div className="flex flex-1 flex-col items-center">
              <div />
            </div>
            <div className="flex flex-1 flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                2
              </div>
              <span className="mt-2 text-sm font-medium">Payment</span>
            </div>
          </div>

          {step === 1 ? (
            <div className="rounded-lg border">
              <div className="p-6">
                <h2 className="text-xl font-medium">Shipping Address</h2>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Select Delivery Address</h3>
                      <Link href="/account/addresses">
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add New Address
                        </Button>
                      </Link>
                    </div>

                    {addresses.length === 0 ? (
                      <div className="text-center py-8">
                        <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h3 className="mt-4 font-medium">No addresses found</h3>
                        <p className="mt-2 text-sm text-muted-foreground">Please add a delivery address to continue</p>
                        <Link href="/account/addresses">
                          <Button className="mt-4">Add Address</Button>
                        </Link>
                      </div>
                    ) : (
                      <RadioGroup
                        value={selectedAddressId || ""}
                        onValueChange={setSelectedAddressId}
                        className="space-y-4"
                      >
                        {addresses.map((address) => (
                          <div key={address.id} className="flex items-start space-x-3">
                            <RadioGroupItem value={address.id} id={`address-${address.id}`} className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor={`address-${address.id}`} className="flex items-center cursor-pointer">
                                <Card
                                  className={`w-full border ${selectedAddressId === address.id ? "border-primary" : ""}`}
                                >
                                  <CardContent className="p-4">
                                    <div className="space-y-1 text-sm">
                                      <div className="flex justify-between">
                                        <p className="font-medium">{address.name}</p>
                                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                          {address.type === "home" ? "Home" : "Work"}
                                        </span>
                                      </div>
                                      <p>{address.addressLine1}</p>
                                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                                      <p>
                                        {address.city}, {address.state} {address.pincode}
                                      </p>
                                      <p className="pt-1">{address.phone}</p>
                                    </div>
                                    {address.isDefault && (
                                      <div className="mt-2">
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                          Default Address
                                        </span>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              </Label>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="notes">Order Notes (Optional)</Label>
                    <Textarea id="notes" placeholder="Notes about your order, e.g. special notes for delivery" />
                  </div>

                  <Button type="submit" className="w-full" disabled={!selectedAddressId}>
                    Continue to Payment
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border">
              <div className="p-6">
                <h2 className="text-xl font-medium">Payment Method</h2>

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                        <CreditCard className="h-5 w-5" />
                        Credit/Debit Card
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer">
                        <Wallet className="h-5 w-5" />
                        UPI Payment
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer">
                        <Truck className="h-5 w-5" />
                        Cash on Delivery
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" required />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" required />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="nameOnCard">Name on Card</Label>
                        <Input id="nameOnCard" required />
                      </div>
                    </div>
                  )}

                  {paymentMethod === "upi" && (
                    <div>
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input id="upiId" placeholder="name@upi" required />
                    </div>
                  )}

                  <Button type="submit" className="w-full">
                    Place Order
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <div className="rounded-lg border">
            <div className="p-6">
              <h2 className="text-xl font-medium">Order Summary</h2>

              <Separator className="my-4" />

              <div className="max-h-[300px] overflow-auto space-y-4">
                {cart.map((item, index) => (
                  <div key={`${item.id}-${item.size}-${item.color}-${index}`} className="flex gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="font-medium line-clamp-1">{item.name}</p>
                        {/* Display size and color if available */}
                        {(item.size || item.color) && (
                          <div className="text-xs text-muted-foreground">
                            {item.color && <span>Color: {item.color}</span>}
                            {item.color && item.size && <span> | </span>}
                            {item.size && <span>Size: {item.size}</span>}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span>₹{item.price.toLocaleString()}</span>
                          <span className="text-sm text-muted-foreground">x {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

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

                {/* Wallet Balance Section */}
                {totalBeforeWallet > 200 && (
                  <>
                    <Separator />
                    <div className="p-3 bg-primary/5 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <Checkbox
                          id="useWallet"
                          checked={useWalletBalance}
                          onCheckedChange={(checked) => setUseWalletBalance(checked === true)}
                        />
                        <Label htmlFor="useWallet" className="flex items-center gap-2 cursor-pointer">
                          <Wallet className="h-4 w-4 text-primary" />
                          <span>Use Wallet Balance</span>
                        </Label>
                      </div>
                      <div className="text-sm text-muted-foreground">Available: ₹{walletBalance}</div>
                      {useWalletBalance && (
                        <div className="flex justify-between mt-2 text-primary font-medium">
                          <span>Applied from wallet</span>
                          <span>-₹{appliedWalletAmount}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <Separator />

                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="h-4 w-4" />
                  <span>Free shipping on orders over ₹500</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Secure payment</span>
                </div>
                {totalBeforeWallet > 200 && !useWalletBalance && (
                  <Alert className="mt-2 bg-primary/5 border-primary/20">
                    <AlertDescription className="text-sm flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-primary" />
                      You can use your wallet balance for this order
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}