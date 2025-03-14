"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, Eye, Upload, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState, useRef } from "react"
import { Label } from "@/components/ui/label"
import Image from "next/image"

// Mock orders data
const orders = [
  {
    id: "ORD12345",
    date: "2023-05-15",
    status: "Delivered",
    total: 2499,
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
  },
  {
    id: "ORD12346",
    date: "2023-04-28",
    status: "Shipped",
    total: 1999,
    items: [
      {
        id: "4",
        name: "Non-Stick Cookware Set",
        price: 1999,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
  },
  {
    id: "ORD12347",
    date: "2023-05-20",
    status: "Pending",
    total: 1299,
    items: [
      {
        id: "5",
        name: "Women's Running Shoes",
        price: 1299,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
  },
]

export default function OrdersPage() {
  // Add state for media upload dialog
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null)
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null)
  const [selectedVideoPreview, setSelectedVideoPreview] = useState<string | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

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
    console.log("For order:", currentOrderId)

    // Close the dialog after submission
    setIsUploadDialogOpen(false)

    // Reset selected media
    setSelectedImage(null)
    setSelectedVideo(null)
    setSelectedImagePreview(null)
    setSelectedVideoPreview(null)
    setCurrentOrderId(null)

    // Show success message
    alert("Media uploaded successfully!")
  }

  // Function to handle order cancellation
  const handleCancelOrder = (orderId: string) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      // In a real application, you would make an API call to cancel the order
      console.log("Cancelling order:", orderId)
      alert("Order cancelled successfully!")
    }
  }

  // Function to open upload dialog
  const openUploadDialog = (orderId: string) => {
    setCurrentOrderId(orderId)
    setIsUploadDialogOpen(true)
  }

  return (
    <div className="w-full px-4 py-8 md:px-6 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <Link href="/account">
          <Button variant="outline">Back to Account</Button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-medium">No orders yet</h2>
            <p className="mt-2 text-center text-muted-foreground">
              You haven't placed any orders yet. Start shopping to place your first order.
            </p>
            <Link href="/shop">
              <Button className="mt-6">Start Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Desktop View */}
          <div className="hidden md:block">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.status === "Delivered"
                                ? "default"
                                : order.status === "Processing" || order.status === "Shipped"
                                  ? "secondary"
                                  : order.status === "Pending"
                                    ? "outline"
                                    : "outline"
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>₹{order.total.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link href={`/account/orders/${order.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Button>
                            </Link>
                            {order.status === "Pending" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleCancelOrder(order.id)}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                              </Button>
                            )}
                            {order.status === "Shipped" && (
                              <Button variant="ghost" size="sm" onClick={() => openUploadDialog(order.id)}>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{order.id}</CardTitle>
                    <Badge
                      variant={
                        order.status === "Delivered"
                          ? "default"
                          : order.status === "Processing" || order.status === "Shipped"
                            ? "secondary"
                            : order.status === "Pending"
                              ? "outline"
                              : "outline"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total:</span>
                      <span>₹{order.total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items:</span>
                      <span>{order.items.length}</span>
                    </div>
                    <div className="pt-2 flex flex-col gap-2">
                      <Link href={`/account/orders/${order.id}`}>
                        <Button className="w-full">View Order</Button>
                      </Link>
                      {order.status === "Pending" && (
                        <Button
                          variant="outline"
                          className="w-full text-destructive hover:text-destructive"
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel Order
                        </Button>
                      )}
                      {order.status === "Shipped" && (
                        <Button variant="outline" className="w-full" onClick={() => openUploadDialog(order.id)}>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Unloading
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      {/* Upload Media Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
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
    </div>
  )
}

