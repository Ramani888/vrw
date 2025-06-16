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
import { serverCreateOrder, serverCreateRazorpayOrder, serverGetCartData, serverGetDeliveryAddressData, serverGetRewardData, serverVerifyRazorpayPayment } from "@/services/serverApi"
import { useAuth } from "@/components/auth-provider"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"

interface AddressType {
  _id: string;
  addressFirst: string;
  addressSecond?: string;
  area: string;
  landmark?: string;
  country: string;
  state: string;
  city: string;
  pinCode: string;
  isDefault?: boolean;
  userId?: string;
}

export default function CheckoutPage() {
  const { user } = useAuth();
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [useWalletBalance, setUseWalletBalance] = useState(false)
  const [loading, setLoading] = useState<boolean>(false);
  const [cartData, setCartData] = useState<any>(null);
  const [rewardData, setRewardData] = useState<any>(null);
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState<boolean>(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpay = () => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.async = true
      script.onload = () => {
        setIsRazorpayLoaded(true)
      }
      document.body.appendChild(script)
    }

    loadRazorpay()

    return () => {
      // Clean up script if component unmounts
      const script = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
      if (script) {
        document.body.removeChild(script)
      }
    }
  }, [])

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 1) {
      if (!selectedAddressId) {
        toast({
          title: "Error",
          description: "Please select a delivery address",
        })
        return
      }
      setStep(2)
    } else {
      if (paymentMethod === "razorpay") {
        // handleRazorpayPayment()
      } else if (paymentMethod === "cod") {
        // Process COD order
        // processOrder("COD")
      } else {
        // Handle other payment methods
        toast({
          title: "Payment method not supported",
          description: "Please select a different payment method"
        })
      }
    }
  }

  // Handle Razorpay payment
  const handleRazorpayPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRazorpayLoaded) {
      toast({
        title: "Payment gateway loading",
        description: "Please wait while we load the payment gateway"
      });
      return;
    }

    setIsProcessingPayment(true);

    try {
      // 1. Create order on backend
      // const orderRes = await fetch("/api/razorpay/create-order", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ amount: finalPrice * 100, currency: "INR" }),
      // });
      const orderData = await serverCreateRazorpayOrder({amount: finalPrice});
      // console.log("orderRes", orderRes);
      // const orderData = await orderRes.json();
      if (!orderData.id) throw new Error("Order creation failed");

      let razorpayInstance: any = null;
      let pollingInterval: any = null;

      const options = {
        key: "rzp_live_g5FHxyE0FQivlu",
        amount: finalPrice * 100,
        currency: "INR",
        name: "VR Fashion",
        description: "Purchase from VR Fashion",
        order_id: orderData.id,
        handler: (response: any) => {
          // For card/UPI direct payments
          clearInterval(pollingInterval);
          processOrder("Razorpay", response.razorpay_payment_id, Number(finalPrice));
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.mobileNumber || "",
        },
        theme: { color: "#3B82F6" },
        modal: {
          ondismiss: async () => {
            clearInterval(pollingInterval);
            setIsProcessingPayment(false);
            // Check payment status one last time
            // const statusRes = await fetch(`/api/razorpay/check-status?order_id=${orderData.id}`);
            const statusData = await serverVerifyRazorpayPayment(orderData?.id);
            // console.log("modal statusRes", statusRes);
            // const statusData = await statusRes.json();
            if (statusData.status === "paid") {
              processOrder("Razorpay", statusData.payment_id, Number(finalPrice));
            } else {
              toast({
                title: "Payment not completed",
                description: "You have cancelled the payment or payment is pending."
              });
            }
          },
        },
      };

      razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();

      // 2. Poll for payment status every 5 seconds
      pollingInterval = setInterval(async () => {
        // const statusRes = await fetch(`/api/razorpay/check-status?order_id=${orderData.id}`);
        const statusData = await serverVerifyRazorpayPayment(orderData?.id);
        // console.log("polling statusRes", statusRes);
        // const statusData = await statusRes.json();
        if (statusData.status === "paid") {
          clearInterval(pollingInterval);
          razorpayInstance.close(); // Close the modal programmatically
          processOrder("Razorpay", statusData.payment_id, Number(finalPrice));
        }
      }, 5000);

      // Optionally, show a message to the user
      toast({
        title: "Scan & Pay",
        description: "After scanning and paying, please wait for confirmation or click 'I have paid' in the Razorpay popup."
      });

    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment error",
        description: "There was an error processing your payment. Please try again."
      });
      setIsProcessingPayment(false);
    }
  }

  // Process order after successful payment
  const processOrder = async(paymentMethod: string, paymentId: string, finalPrice: number) => {
    setIsProcessingPayment(true)

    // // In a real app, you would make an API call to create the order
    // setTimeout(() => {
    //   // Clear cart
    //   clearCart()

    //   // Redirect to success page
    //   router.push(
    //     `/checkout/success?orderId=ORD${Date.now()}&paymentMethod=${paymentMethod}${paymentId ? `&paymentId=${paymentId}` : ""}`,
    //   )
    // }, 1500)

    try {
      const productData = cartData?.data?.map((item: any) => {
        return {
          id: item?.product?._id,
          qty: item?.qty,
          price: item?.product?.price,
          deliveryCharge: item?.product?.deliveryCharge,
          reward: item?.reward ?? 0,
        }
      })
      const data = {
        userId: user?._id,
        totalAmount: finalPrice,
        product: productData,
        paymentId: paymentId,
        isWallet: useWalletBalance
      };
      await serverCreateOrder(data);
      // Clear cart
      clearCart()

      // Redirect to success page
      router.push(
        `/checkout/success?orderId=ORD${Date.now()}&paymentMethod=${paymentMethod}${paymentId ? `&paymentId=${paymentId}` : ""}`,
      )
    } catch (error) {
      console.error("Error creating order:", error)
    }
  }

  const getCartData = async () => {
    try {
      setLoading(true);
      const res = await serverGetCartData(String(user?._id?.toString()));
      setCartData(res?.data);
      setLoading(false);
    } catch (error) {
      setCartData(null);
      setLoading(false);
      console.error(error)
    }
  }

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

  const getAddressData = async () => {
    try {
      setLoading(true);
      const res = await serverGetDeliveryAddressData(String(user?._id?.toString()));
      setAddresses(res?.deliveryAddressData || []);
      setSelectedAddressId(res?.deliveryAddressData?.[0]?._id);
    } catch (err) {
      console.error(err);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user?._id) {
      getCartData();
      getRewardData();
      getAddressData();
    }
  }, [user])

  const deliveryCharge = cartData?.totalDeliveryCharge;
  // const deliveryCharge = 1;

  const totalPrice = cartData?.data?.reduce((accumulator: any, item: any) => {
    return accumulator + item?.product?.mrp * item?.qty;
  }, 0);

  const totalDiscount = cartData?.data?.reduce((accumulator: any, item: any) => {
    const discount =
      item?.product?.mrp * item?.qty - item?.product?.price * item?.qty;
    return accumulator + discount;
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

  const price = total + parseInt(String(deliveryCharge));
  const isWalletTabDiable = total > 200 ? false : true;
  const walletBalance = useWalletBalance ? rewardData?.remainingReward : 0;
  const finalPrice = price > walletBalance ? price - walletBalance : 0;

  // Add a rendering function for the skeleton loader
  const renderSkeleton = () => {
    return (
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left column skeleton */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border p-6">
            <Skeleton className="h-8 w-40 mb-6" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-8 w-32" />
              </div>
              
              {/* Address skeletons */}
              {Array(2).fill(0).map((_, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <Skeleton className="h-4 w-4 rounded-full mt-1" />
                  <div className="flex-1">
                    <div className="w-full border rounded-lg p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-24 w-full" />
              </div>
              
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
        
        {/* Order summary skeleton */}
        <div>
          <div className="rounded-lg border">
            <div className="p-6">
              <Skeleton className="h-7 w-40 mb-4" />
              <div className="my-4 h-[1px] bg-gray-200" />
              
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-16 w-16 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="my-4 h-[1px] bg-gray-200" />
              
              <div className="space-y-3">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
                
                <div className="my-4 h-[1px] bg-gray-200" />
                
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If cart is empty, redirect to cart page
  if (cart.length === 0) {
    return (
      <div className="w-full px-4 py-8 md:px-6 md:py-12">
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
    <div className="w-full px-4 py-8 md:px-6 md:py-12">
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

      {loading ? (
        renderSkeleton()
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Checkout Steps */}
          <div className="lg:col-span-2">
            {/* Step indicators removed as per comment */}

            {step === 1 ? (
              <div className="rounded-lg border">
                <div className="p-6">
                  <h2 className="text-xl font-medium">Shipping Address</h2>

                  <form onSubmit={handleRazorpayPayment} className="mt-6 space-y-4">
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
                            <div key={address?._id} className="flex items-start space-x-3">
                              <RadioGroupItem value={address?._id} id={`address-${address?._id}`} className="mt-1" />
                              <div className="flex-1">
                                <Label htmlFor={`address-${address?._id}`} className="flex items-center cursor-pointer">
                                  <Card
                                    className={`w-full border ${selectedAddressId === address?._id ? "border-primary" : ""}`}
                                  >
                                    <CardContent className="p-4">
                                      <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                          {/* <p className="font-medium">{address.name}</p> */}
                                          <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                            {"Home"}
                                          </span>
                                        </div>
                                        <p>{address?.addressFirst}</p>
                                        {address?.addressSecond && <p>{address?.addressSecond}</p>}
                                        <p>
                                          {address.area}
                                          {address.landmark && `, ${address.landmark}`}
                                          {`, ${address.city}, ${address.state}, ${address.country}, ${address.pinCode}`}
                                        </p>
                                        {/* <p className="pt-1">{address.phone}</p> */}
                                      </div>
                                      {/* {address.isDefault && ( */}
                                        <div className="mt-2">
                                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                            Default Address
                                          </span>
                                        </div>
                                      {/* )} */}
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
              <></>
              // <div className="rounded-lg border">
              //   <div className="p-6">
              //     <h2 className="text-xl font-medium">Payment Method</h2>

              //     <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              //       <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              //         <div className="flex items-center space-x-2 rounded-lg border p-4">
              //           <RadioGroupItem value="card" id="card" />
              //           <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
              //             <CreditCard className="h-5 w-5" />
              //             Credit/Debit Card
              //           </Label>
              //         </div>

              //         <div className="flex items-center space-x-2 rounded-lg border p-4">
              //           <RadioGroupItem value="upi" id="upi" />
              //           <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer">
              //             <Wallet className="h-5 w-5" />
              //             UPI Payment
              //           </Label>
              //         </div>

              //         <div className="flex items-center space-x-2 rounded-lg border p-4">
              //           <RadioGroupItem value="cod" id="cod" />
              //           <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer">
              //             <Truck className="h-5 w-5" />
              //             Cash on Delivery
              //           </Label>
              //         </div>
              //       </RadioGroup>

              //       {paymentMethod === "card" && (
              //         <div className="space-y-4">
              //           <div>
              //             <Label htmlFor="cardNumber">Card Number</Label>
              //             <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
              //           </div>

              //           <div className="grid grid-cols-2 gap-4">
              //             <div>
              //               <Label htmlFor="expiry">Expiry Date</Label>
              //               <Input id="expiry" placeholder="MM/YY" required />
              //             </div>
              //             <div>
              //               <Label htmlFor="cvv">CVV</Label>
              //               <Input id="cvv" placeholder="123" required />
              //             </div>
              //           </div>

              //           <div>
              //             <Label htmlFor="nameOnCard">Name on Card</Label>
              //             <Input id="nameOnCard" required />
              //           </div>
              //         </div>
              //       )}

              //       {paymentMethod === "upi" && (
              //         <div>
              //           <Label htmlFor="upiId">UPI ID</Label>
              //           <Input id="upiId" placeholder="name@upi" required />
              //         </div>
              //       )}

              //       <Button type="submit" className="w-full">
              //         Place Order
              //       </Button>
              //     </form>
              //   </div>
              // </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <div className="rounded-lg border">
              <div className="p-6">
                <h2 className="text-xl font-medium">Order Summary</h2>

                <Separator className="my-4" />

                <div className="max-h-[300px] overflow-auto space-y-4">
                  {cartData?.data?.map((item: any, index: any) => (
                    <div key={index} className="flex gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                        <Image src={item?.product?.image?.[0]?.path || "/placeholder.svg"} alt={item?.product?.name} fill className="object-cover" />
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="font-medium line-clamp-1">{item?.product?.name}</p>
                          {/* Display size and color if available */}
                          {(item?.product?.size || item?.product?.color) && (
                            <div className="text-xs text-muted-foreground">
                              {item?.product?.color && <span>Color: {item?.product?.color}</span>}
                              {item?.product?.color && item?.product?.size && <span> | </span>}
                              {item?.product?.size && <span>Size: {item?.product?.size?.[0]}</span>}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span>₹{item?.product?.price?.toLocaleString()}</span>
                            <span className="text-sm text-muted-foreground">x {item?.qty}</span>
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
                  {Math.round(totalGst) !== 0 && (
                    <div className="flex justify-between">
                      <span>GST</span>
                      <span>₹{Math.round(totalGst).toLocaleString()}</span>
                    </div>
                  )}
                  {Math.round(totalIgst) !== 0 && (
                    <div className="flex justify-between">
                      <span>IGST</span>
                      <span>₹{Math.round(totalIgst).toLocaleString()}</span>
                    </div>
                  )}
                  {Math.round(totalSgst) !== 0 && (
                    <div className="flex justify-between">
                      <span>SGST</span>
                      <span>₹{Math.round(totalSgst).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span>{Number(deliveryCharge) === 0 ? "Free" : `₹${deliveryCharge}`}</span>
                  </div>

                  {/* Wallet Balance Section */}
                  {total > 200 && (
                    <>
                      <Separator />
                      <div className="p-3 bg-primary/5 rounded-md">
                        <div className="flex items-center gap-2 mb-2">
                          <Checkbox
                            id="useWallet"
                            checked={useWalletBalance}
                            onCheckedChange={(checked) => setUseWalletBalance(checked === true)}
                            disabled={isWalletTabDiable}
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
                            <span>-₹{rewardData?.remainingReward}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <Separator />

                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>₹{finalPrice?.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    <span>Free shipping on orders over ₹500</span>
                  </div> */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Secure payment</span>
                  </div>
                  {total > 200 && !useWalletBalance && (
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
      )}
    </div>
  )
}