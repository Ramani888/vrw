"use client"

import type React from "react"

import { useState, useRef, use } from "react"
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

// Mock order data
const orders = {
  ORD12345: {
    id: "ORD12345",
    date: "2023-05-15",
    status: "Delivered",
    total: 2499,
    paymentMethod: "Credit Card",
    shippingAddress: {
      name: "John Doe",
      addressLine1: "123 Main Street",
      addressLine2: "Apt 4B",
      city: "New York",
      state: "NY",
      pincode: "10001",
      phone: "+1 (123) 456-7890",
    },
    items: [
      {
        id: "1",
        name: "Wireless Bluetooth Earbuds",
        price: 1499,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "8",
        name: "Smartphone Stand and Holder",
        price: 299,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    timeline: [
      { status: "Order Placed", date: "May 15, 2023", time: "10:30 AM" },
      { status: "Payment Confirmed", date: "May 15, 2023", time: "10:35 AM" },
      { status: "Processing", date: "May 16, 2023", time: "09:00 AM" },
      { status: "Shipped", date: "May 17, 2023", time: "02:15 PM" },
      { status: "Out for Delivery", date: "May 19, 2023", time: "08:45 AM" },
      { status: "Delivered", date: "May 19, 2023", time: "03:20 PM" },
    ],
  },
  ORD12346: {
    id: "ORD12346",
    date: "2023-04-28",
    status: "Delivered",
    total: 1999,
    paymentMethod: "UPI",
    shippingAddress: {
      name: "John Doe",
      addressLine1: "123 Main Street",
      addressLine2: "Apt 4B",
      city: "New York",
      state: "NY",
      pincode: "10001",
      phone: "+1 (123) 456-7890",
    },
    items: [
      {
        id: "4",
        name: "Non-Stick Cookware Set",
        price: 1999,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    timeline: [
      { status: "Order Placed", date: "April 28, 2023", time: "11:45 AM" },
      { status: "Payment Confirmed", date: "April 28, 2023", time: "11:50 AM" },
      { status: "Processing", date: "April 29, 2023", time: "10:15 AM" },
      { status: "Shipped", date: "April 30, 2023", time: "01:30 PM" },
      { status: "Out for Delivery", date: "May 2, 2023", time: "09:20 AM" },
      { status: "Delivered", date: "May 2, 2023", time: "04:10 PM" },
    ],
  },
  ORD12347: {
    id: "ORD12347",
    date: "2023-05-20",
    status: "Processing",
    total: 1299,
    paymentMethod: "Cash on Delivery",
    shippingAddress: {
      name: "John Doe",
      addressLine1: "123 Main Street",
      addressLine2: "Apt 4B",
      city: "New York",
      state: "NY",
      pincode: "10001",
      phone: "+1 (123) 456-7890",
    },
    items: [
      {
        id: "5",
        name: "Women's Running Shoes",
        price: 1299,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    timeline: [
      { status: "Order Placed", date: "May 20, 2023", time: "03:15 PM" },
      { status: "Processing", date: "May 21, 2023", time: "09:30 AM" },
    ],
  },
  ORD12348: {
    id: "ORD12348",
    date: "2024-01-01",
    status: "Pending",
    total: 999,
    paymentMethod: "Credit Card",
    shippingAddress: {
      name: "Jane Smith",
      addressLine1: "456 Oak Avenue",
      addressLine2: null,
      city: "Los Angeles",
      state: "CA",
      pincode: "90001",
      phone: "+1 (310) 555-1212",
    },
    items: [
      {
        id: "9",
        name: "Smart Watch",
        price: 999,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    timeline: [{ status: "Order Placed", date: "January 1, 2024", time: "12:00 PM" }],
  },
  ORD12349: {
    id: "ORD12349",
    date: "2024-01-05",
    status: "Shipped",
    total: 499,
    paymentMethod: "PayPal",
    shippingAddress: {
      name: "Alice Johnson",
      addressLine1: "789 Pine Lane",
      addressLine2: "Unit 10",
      city: "Chicago",
      state: "IL",
      pincode: "60601",
      phone: "+1 (773) 555-3434",
    },
    items: [
      {
        id: "10",
        name: "Bluetooth Speaker",
        price: 499,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    timeline: [
      { status: "Order Placed", date: "January 5, 2024", time: "09:00 AM" },
      { status: "Payment Confirmed", date: "January 5, 2024", time: "09:05 AM" },
      { status: "Shipped", date: "January 6, 2024", time: "03:00 PM" },
    ],
  },
}

export default function OrderDetailPage({params}: {params: Promise<{ id: string }>}) {
  const { id } = use(params);
  const router = useRouter()
  const order = orders[id as keyof typeof orders]
  const [isDownloading, setIsDownloading] = useState(false)

  // Add state for upload dialog
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null)
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null)
  const [selectedVideoPreview, setSelectedVideoPreview] = useState<string | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  if (!order) {
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
  const subtotal = order.items.reduce((total, item) => total + item.price * item.quantity, 0)

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
          <title>Invoice ${order.id}</title>
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
            <div>ShopEase</div>
          </div>
          
          <div>
            <strong>Order ID:</strong> ${order.id}<br>
            <strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}<br>
            <strong>Status:</strong> ${order.status}<br>
            <strong>Payment Method:</strong> ${order.paymentMethod}
          </div>
          
          <div class="section-title">BILL TO:</div>
          <div class="address-details">
            ${order.shippingAddress.name}<br>
            ${order.shippingAddress.addressLine1}<br>
            ${order.shippingAddress.addressLine2 ? order.shippingAddress.addressLine2 + "<br>" : ""}
            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}<br>
            ${order.shippingAddress.phone}
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
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>₹${item.price.toLocaleString()}</td>
                  <td>${item.quantity}</td>
                  <td>₹${(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
                <td>₹${subtotal.toLocaleString()}</td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: right;"><strong>Shipping:</strong></td>
                <td>${shipping === 0 ? "Free" : `₹${shipping}`}</td>
              </tr>
              <tr class="total-row">
                <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
                <td>₹${order.total.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
          
          <div class="footer">
            Thank you for shopping with ShopEase!<br>
            For any queries, please contact support@shopease.com
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
        <h1 className="text-2xl font-bold md:text-3xl">Order #{order.id}</h1>
        <Badge
          variant={order.status === "Delivered" ? "default" : order.status === "Processing" ? "secondary" : "outline"}
          className="text-sm px-3 py-1"
        >
          {order.status}
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
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link href={`/product/${item.id}`} className="font-medium hover:underline">
                          {item.name}
                        </Link>
                        <div className="mt-1 text-sm text-muted-foreground">Quantity: {item.quantity}</div>
                      </div>

                      <div className="font-medium">₹{item.price.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted"></div>
                <div className="space-y-6">
                  {order.timeline.map((event, index) => (
                    <div key={index} className="relative flex gap-4">
                      <div className="absolute left-4 top-2 -ml-2 h-4 w-4 rounded-full bg-primary"></div>
                      <div className="ml-8">
                        <h4 className="font-medium">{event.status}</h4>
                        <p className="text-sm text-muted-foreground">
                          {event.date} at {event.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
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
                  <span>{new Date(order.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID</span>
                  <span>{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span>{order.paymentMethod}</span>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>₹{order.total.toLocaleString()}</span>
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
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                </p>
                <p className="pt-1">{order.shippingAddress.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-full">
              <Truck className="mr-2 h-4 w-4" />
              Track Order
            </Button>

            {/* Conditionally render Cancel Order button when status is Pending */}
            {order.status === "Pending" && (
              <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                <X className="mr-2 h-4 w-4" />
                Cancel Order
              </Button>
            )}

            {/* Conditionally render Upload Unloading button when status is Shipped */}
            {order.status === "Shipped" && (
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

            <Button variant="outline" className="w-full">
              <Package className="mr-2 h-4 w-4" />
              Return or Replace Items
            </Button>

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

