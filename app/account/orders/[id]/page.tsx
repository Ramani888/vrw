"use client"

import type React from "react"

import { useState, useRef, use, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Package, Truck, MapPin, Download, Upload, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-provider"
import { serverGetDeliveryAddressData, serverGetOrder } from "@/services/serverApi"

export default function OrderDetailPage({params}: {params: Promise<{ id: string }>}) {
  const { user } = useAuth()
  const { id } = use(params);
  const router = useRouter()
  const [isDownloading, setIsDownloading] = useState(false)

  // Add state for upload dialog
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null)
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null)
  const [selectedVideoPreview, setSelectedVideoPreview] = useState<string | null>(null)
  const [orderData, setOrderData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [addressData, setAddressData] = useState<any>({})
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  // Define getOrderData as a useCallback to prevent recreation on every render
  const getOrderData = useCallback(async () => {
    if (!user?._id) {
      return;
    }
    
    try {
      setLoading(true);
      const res = await serverGetOrder(user._id.toString());
      const addressRes = await serverGetDeliveryAddressData(user._id.toString());
      if (res?.data) {
        setOrderData(res.data);
        setAddressData(addressRes.deliveryAddressData?.[0]);
      } else {
        setOrderData([]);
        setAddressData([]);
      }
    } catch (error) {
      console.log(error);
      setOrderData([]);
      setAddressData([]);
    } finally {
      setLoading(false);
    }
  }, [user?._id, id]); // Include both user._id and id as dependencies

  // Single useEffect that runs once when component mounts and when dependencies change
  useEffect(() => {
    if (user?._id) {
      getOrderData();
    }
  }, [user?._id, id, getOrderData]);

  const findOrderData = orderData?.find((item: any) => item?._id?.toString() === id);

  // Display skeleton loader while loading
  if (loading) {
    return (
      <div className="w-full px-4 py-8 md:px-6 md:py-12">
        <div className="mb-8">
          <div className="w-24 h-10 rounded-md bg-gray-200 animate-pulse"></div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items Skeleton */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6 flex flex-row items-center">
                <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
              <div className="p-6 pt-0">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                      <div className="h-20 w-20 bg-gray-200 rounded-md animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 w-3/4 bg-gray-200 rounded-md animate-pulse"></div>
                        <div className="h-4 w-1/4 bg-gray-200 rounded-md animate-pulse"></div>
                        <div className="h-5 w-1/5 bg-gray-200 rounded-md animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Order Summary Skeleton */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6 flex flex-row items-center">
                <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
              <div className="p-6 pt-0">
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-4 w-1/3 bg-gray-200 rounded-md animate-pulse"></div>
                      <div className="h-4 w-1/4 bg-gray-200 rounded-md animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Shipping Address Skeleton */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6 flex flex-row items-center">
                <div className="h-6 w-40 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
              <div className="p-6 pt-0">
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-4 w-full bg-gray-200 rounded-md animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Skeleton */}
            <div className="flex flex-col gap-2">
              <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse"></div>
              <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Now check if order exists - AFTER defining function and useEffect
  if (!findOrderData) {
    return (
      <div className="w-full px-4 py-8 md:px-6 md:py-12">
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-xl font-medium">Order not found</h2>
          <p className="mt-2 text-center text-muted-foreground">
            The order you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/account/orders">
            <Button className="mt-6">Back to Orders</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Calculate subtotal
  const subtotal = findOrderData?.productDetails?.reduce((total: number, item: any) => total + item?.product?.price * item?.qty, 0)

  // Calculate shipping (free over ₹500)
  const shipping = subtotal > 500 ? 0 : 50

  // Function to download invoice
  const downloadInvoice = () => {
    setIsDownloading(true)

    // In a real-world scenario, you'd use a library like jsPDF
    // This is a simplified example to illustrate the concept
    const generatePDF = () => {
      // Create a new window for the PDF
      const printWindow = window.open("", "_blank")

      if (!printWindow) {
        alert("Please allow popups to download the invoice")
        setIsDownloading(false)
        return
      }

      // Create invoice HTML content with table styling
      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice ${findOrderData?._id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            .invoice-header {
              text-align: center;
              margin-bottom: 30px;
            }
            .invoice-title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
              margin-top: 20px;
              margin-bottom: 10px;
              padding-bottom: 5px;
              border-bottom: 1px solid #ddd;
            }
            .address-details {
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            .total-row {
              font-weight: bold;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <div class="invoice-title">INVOICE</div>
            <div>VR Fashion</div>
          </div>
          
          <div>
            <strong>Payment ID:</strong> ${findOrderData?.paymentId}<br>
            <strong>Date:</strong> ${new Date(findOrderData?.createdAt).toLocaleDateString()}<br>
            <strong>Status:</strong> ${findOrderData?.status}<br>
          </div>
          
          <div class="section-title">BILL TO:</div>
          <div class="address-details">
            ${addressData?.addressFirst}<br>
            ${addressData?.addressSecond ? addressData?.addressSecond + "<br>" : ""}
            ${addressData?.area}, ${addressData?.landmark}, ${addressData?.country}, ${addressData?.state}, ${addressData?.city}, ${addressData?.pinCode}<br>
          </div>
          
          <div class="section-title">ITEMS:</div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${findOrderData?.productDetails?.map(
                  (item: any) => `
                <tr>
                  <td>${item?.product?.name}</td>
                  <td>₹${item?.product?.price?.toLocaleString()}</td>
                  <td>${item?.qty}</td>
                  <td>₹${(item?.product?.price * item?.qty)?.toLocaleString()}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
                <td>₹${subtotal?.toLocaleString()}</td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: right;"><strong>Shipping:</strong></td>
                <td>${shipping === 0 ? "Free" : `₹${shipping}`}</td>
              </tr>
              <tr class="total-row">
                <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
                <td>₹${findOrderData?.totalAmount?.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
          
          <div class="footer">
            Thank you for shopping with VR Fashion!<br>
            For any queries, please contact vrfashionjewellery0044@gmail.com
          </div>
        </body>
        </html>
      `

      // Write to the new window
      printWindow.document.write(invoiceHTML)
      printWindow.document.close()

      // Print the window (which will show the print dialog to save as PDF)
      setTimeout(() => {
        printWindow.print()
        setIsDownloading(false)
      }, 500)
    }

    generatePDF()
  }

  // Function to handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedImage(file)
      setSelectedImagePreview(URL.createObjectURL(file))
    }
  }

  // Function to handle video selection
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedVideo(file)
      setSelectedVideoPreview(URL.createObjectURL(file))
    }
  }

  // Function to handle media submission
  const handleSubmitMedia = () => {
    // In a real application, you would upload the files to a server here
    console.log("Uploading image:", selectedImage)
    console.log("Uploading video:", selectedVideo)

    // Close the dialog after submission
    setIsUploadDialogOpen(false)

    // Show success message
    alert("Media uploaded successfully!")
  }

  return (
    <div className="w-full px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">Order #{findOrderData?.id}</h1>
        <Badge
          variant={findOrderData?.status === "Delivered" ? "default" : findOrderData?.status === "Processing" ? "secondary" : "outline"}
          className="text-sm px-3 py-1"
        >
          {findOrderData?.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {findOrderData?.productDetails?.map((item: any, index: number) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                      <Image src={item?.product?.image?.[0]?.path || "/placeholder.svg"} alt={item?.product?.name} fill className="object-cover" />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link href={`/product/${item?.product?._id}`} className="font-medium hover:underline">
                          {item?.product?.name}
                        </Link>
                        <div className="mt-1 text-sm text-muted-foreground">Quantity: {item?.qty}</div>
                      </div>

                      <div className="font-medium">₹{item?.product?.price?.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Date</span>
                  <span>{new Date(findOrderData?.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment ID</span>
                  <span>{findOrderData?.paymentId}</span>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>₹{findOrderData?.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader className="flex flex-row items-center">
              <MapPin className="mr-2 h-4 w-4" />
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {/* <p className="font-medium">{addressData?.name}</p> */}
                <p>{addressData?.addressFirst}</p>
                {addressData?.addressSecond && <p>{addressData?.addressSecond}</p>}
                <p>
                  {addressData?.area}, {addressData?.landmark}, {addressData?.country}, {addressData?.state}, {addressData?.city}, {addressData?.pinCode}
                </p>
                {/* <p className="pt-1">{order.shippingAddress.phone}</p> */}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col gap-2">

            {/* Conditionally render Cancel Order button when status is Pending */}
            {findOrderData?.status === "Pending" && (
              <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                <X className="mr-2 h-4 w-4" />
                Cancel Order
              </Button>
            )}

            {/* Conditionally render Upload Unloading button when status is Shipped */}
            {findOrderData?.status === "Shipped" && (
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Unloading
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Upload Unloading Media</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="image">Upload Image</Label>
                      <Input ref={imageInputRef} id="image" type="file" accept="image/*" onChange={handleImageSelect} />
                      {selectedImagePreview && (
                        <div className="mt-2 relative aspect-video rounded-md overflow-hidden border">
                          <Image
                            src={selectedImagePreview || "/placeholder.svg"}
                            alt="Selected image"
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="video">Upload Video</Label>
                      <Input ref={videoInputRef} id="video" type="file" accept="video/*" onChange={handleVideoSelect} />
                      {selectedVideoPreview && (
                        <div className="mt-2 rounded-md overflow-hidden border">
                          <video src={selectedVideoPreview} controls className="w-full h-auto max-h-[200px]" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSubmitMedia} disabled={!selectedImage && !selectedVideo}>
                      Submit
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            <Button variant="outline" className="w-full" onClick={downloadInvoice} disabled={isDownloading}>
              <Download className="mr-2 h-4 w-4" />
              {isDownloading ? "Downloading..." : "Download Invoice"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

