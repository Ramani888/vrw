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
import { useState, useRef, useEffect } from "react"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { serverGetOrder } from "@/services/serverApi"
import { useAuth } from "@/components/auth-provider"
import { set } from "zod"
import { Skeleton } from "@/components/ui/skeleton"

export default function OrdersPage() {
  const { user } = useAuth()
  // Add state for media upload dialog
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null)
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null)
  const [selectedVideoPreview, setSelectedVideoPreview] = useState<string | null>(null)
  const [orderData, setOrderData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
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

  const getOrderData = async () => {
    try {
      setLoading(true);
      const res = await serverGetOrder(String(user?._id?.toString()));
      setOrderData(res?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setOrderData([]);
      console.error(error)
    }
  }

  useEffect(() => {
    getOrderData();
  }, [user])

  return (
    <div className="w-full px-4 py-8 md:px-6 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <Link href="/account">
          <Button variant="outline">Back to Account</Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-6">
          {/* Desktop Skeleton */}
          <div className="hidden md:block">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array(3).fill(0).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-8 w-20" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Skeleton */}
          <div className="md:hidden space-y-4">
            {Array(3).fill(0).map((_, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Date:</span>
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total:</span>
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items:</span>
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <div className="pt-2 flex flex-col gap-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : orderData?.length === 0 ? (
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
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderData?.map((order, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{order?.paymentId}</TableCell>
                        <TableCell>{new Date(order?.createdAt)?.toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order?.status === "Delivered"
                                ? "default"
                                : order?.status === "Processing" || order?.status === "Shipped"
                                  ? "secondary"
                                  : order?.status === "Pending"
                                    ? "outline"
                                    : "outline"
                            }
                          >
                            {order?.status}
                          </Badge>
                        </TableCell>
                        <TableCell>₹{order?.totalAmount?.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link href={`/account/orders/${order?._id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Button>
                            </Link>
                            {order?.status === "Pending" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleCancelOrder(order?._id)}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                              </Button>
                            )}
                            {order?.status === "Shipped" && (
                              <Button variant="ghost" size="sm" onClick={() => openUploadDialog(order?._id)}>
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
            {orderData?.map((order) => (
              <Card key={order?._id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{order?.paymentId}</CardTitle>
                    <Badge
                      variant={
                        order?.status === "Delivered"
                          ? "default"
                          : order?.status === "Processing" || order?.status === "Shipped"
                            ? "secondary"
                            : order?.status === "Pending"
                              ? "outline"
                              : "outline"
                      }
                    >
                      {order?.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{new Date(order?.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total:</span>
                      <span>₹{order?.totalAmount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items:</span>
                      <span>{order?.productDetails?.length}</span>
                    </div>
                    <div className="pt-2 flex flex-col gap-2">
                      <Link href={`/account/orders/${order?._id}`}>
                        <Button className="w-full">View Order</Button>
                      </Link>
                      {order?.status === "Pending" && (
                        <Button
                          variant="outline"
                          className="w-full text-destructive hover:text-destructive"
                          onClick={() => handleCancelOrder(order?._id)}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel Order
                        </Button>
                      )}
                      {order?.status === "Shipped" && (
                        <Button variant="outline" className="w-full" onClick={() => openUploadDialog(order?._id)}>
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

