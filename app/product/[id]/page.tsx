"use client"

import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/components/cart-provider"
import { Badge } from "@/components/ui/badge"
import useShop from "@/hooks/useShop"

// Enhanced product type with colors, sizes, and videos
type ProductSize = string | number

type ProductColor = {
  name: string
  code: string // hex color code
}

type ProductImage = {
  url: string
  alt: string
  isVideo?: boolean
}

type ProductSpecification = {
  name: string
  value: string
}

type ProductReview = {
  id: number
  user: string
  rating: number
  comment: string
  date: string
}

type ProductDetails = {
  [key: string]: string
}

type Product = {
  id: string
  name: string
  description: string
  price: number
  mrp: number
  image: string
  category: string
  images: ProductImage[]
  colors: ProductColor[]
  sizes: ProductSize[]
  details: ProductDetails
  specifications: ProductSpecification[]
  reviews: ProductReview[]
}

type RelatedProduct = {
  id: string
  name: string
  description: string
  price: number
  mrp: number
  image: string
  category: string
}

export default function ProductPage({ params }: { params: Promise<{ id?: string }> }) {
  const resolvedParams = React.use(params); // ✅ Unwrap the params Promise
  // const { id } = params;
  const {
    loading,
    productDetail
  } = useShop(resolvedParams?.id);

  const [error, setError] = useState<string | null>(null)

  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null)
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const { addToCart, addToWishlist, isInWishlist, isInCart } = useCart()
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleAddToWishlist = () => {
    if (!productDetail) return

    addToWishlist({
      id: productDetail?.id,
      name: productDetail?.name,
      price: productDetail?.price,
      mrp: productDetail?.mrp,
      image: productDetail?.image,
    })
    setIsWishlisted(true)
  }

  const handleAddToCart = () => {
    if (!productDetail) return

    if (!selectedSize && productDetail?.sizes?.length > 0) {
      alert("Please select a size")
      return
    }

    if (!selectedColor && productDetail?.colors?.length > 0) {
      alert("Please select a color")
      return
    }

    addToCart({
      id: productDetail?.id,
      name: productDetail?.name,
      price: productDetail?.price,
      mrp: productDetail?.mrp,
      image: productDetail?.image,
      // @ts-ignore - We'll update the cart provider type later
      size: selectedSize,
      // @ts-ignore - We'll update the cart provider type later
      color: selectedColor?.name,
    })
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  // Handle image/video navigation
  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index)

    // Pause any playing video when switching images
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }

  // If loading, show loader
  if (loading) {
    return <ProductPageSkeleton />
  }

  // If error, show error message
  if (error || !productDetail) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-xl font-medium text-destructive">Error</h2>
          <p className="mt-2 text-center text-muted-foreground">
            {error || "Product not found. Please try another product."}
          </p>
          <Link href="/shop">
            <Button className="mt-6">Browse Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  const discount = Math.round(((productDetail?.mrp - productDetail?.price) / productDetail?.mrp) * 100)
  const currentMedia = [...productDetail?.image, {path: productDetail?.videoPath, isVideo: true}]?.[currentImageIndex];
  const isVideo = currentMedia?.isVideo;

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Images/Videos */}
        <div className="md:sticky md:top-20">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            {isVideo ? (
              <video
                ref={videoRef}
                src={currentMedia?.path}
                controls
                className="h-full w-full object-cover"
                poster="/placeholder.svg?height=600&width=600&text=Video+Thumbnail"
              />
            ) : (
              <Image
                src={currentMedia?.path || "/placeholder.svg"}
                alt={currentMedia?._id}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {[...productDetail?.image, {path: productDetail?.videoPath, isVideo: true}]?.map((image: any, index: number) => (
              <div
                key={index}
                className={`relative aspect-square overflow-hidden rounded-md border cursor-pointer ${
                  index === currentImageIndex ? "border-primary border-2" : ""
                }`}
                onClick={() => handleThumbnailClick(index)}
              >
                {image?.isVideo ? (
                  <div className="relative h-full w-full">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full bg-black/50 p-1">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 5V19L19 12L8 5Z" fill="white" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Image src={image?.path || "/placeholder.svg"} alt={image?._id} fill className="object-cover" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">{productDetail?.name}</h1>

          <div className="mt-2 flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${star <= 4 ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({productDetail?.reviews?.length} reviews)</span>
          </div>

          <div className="mt-4">
            <p className="text-muted-foreground">{productDetail?.description}</p>
          </div>

          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-3xl font-bold">₹{productDetail?.price?.toLocaleString()}</span>
            {productDetail?.mrp > productDetail?.price && (
              <>
                <span className="text-lg text-muted-foreground line-through">₹{productDetail?.mrp?.toLocaleString()}</span>
                <span className="rounded-md bg-green-100 px-2 py-1 text-sm font-medium text-green-800">
                  {discount}% off
                </span>
              </>
            )}
          </div>

          <div className="mt-6 space-y-4">
            {/* Color Selection */}
            {productDetail?.colors?.length > 0 && (
              <div>
                <h3 className="mb-2 font-medium">Color: {selectedColor?.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {productDetail?.colors?.map((color: any) => (
                    <div
                      key={color?.name}
                      className={`relative h-10 w-10 cursor-pointer rounded-full border-2 ${
                        selectedColor?.name === color?.name ? "border-primary" : "border-muted"
                      }`}
                      style={{ backgroundColor: color?.code }}
                      onClick={() => setSelectedColor(color)}
                    >
                      {selectedColor?.name === color?.name && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check className={`h-5 w-5 ${color?.name === "White" ? "text-black" : "text-white"}`} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {productDetail?.sizes?.length > 0 && productDetail?.sizes[0] !== "Free Size" && (
              <div>
                <div className="flex justify-between">
                  <h3 className="mb-2 font-medium">Size</h3>
                  <button className="text-sm text-primary">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {productDetail?.sizes?.map((size: any) => (
                    <div
                      key={size.toString()}
                      className={`flex h-10 min-w-[2.5rem] cursor-pointer items-center justify-center rounded-md border px-3 ${
                        selectedSize === size
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input hover:border-primary"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Free Size Badge */}
            {productDetail?.sizes?.length === 1 && productDetail?.sizes[0] === "Free Size" && (
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">
                  Free Size
                </Badge>
                <span className="text-sm text-muted-foreground">One size fits all</span>
              </div>
            )}

            {/* Product Details */}
            {/* <div className="grid grid-cols-2 gap-4 text-sm">
              {Object.entries(productDetail?.details).map(([key, value]: any) => (
                <div key={key}>
                  <span className="text-muted-foreground">{key}: </span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div> */}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-r-none"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <div className="flex h-8 w-12 items-center justify-center border-y">{quantity}</div>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-l-none" onClick={incrementQuantity}>
                  +
                </Button>
              </div>
            </div>

            {/* Add to Cart and Wishlist */}
            <div className="flex gap-4">
              <Button
                className="flex-1"
                onClick={handleAddToCart}
                variant={isInCart(productDetail?.id) ? "secondary" : "default"}
                disabled={productDetail?.sizes?.length > 0 && productDetail?.sizes[0] !== "Free Size" && !selectedSize}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {isInCart(productDetail?._id) ? "Added to Cart" : "Add to Cart"}
              </Button>
              <Button variant="outline" onClick={handleAddToWishlist} disabled={isWishlisted}>
                <Heart className={`mr-2 h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </Button>
            </div>

            {/* Size selection warning */}
            {productDetail?.sizes?.length > 0 && productDetail?.sizes[0] !== "Free Size" && !selectedSize && (
              <div className="text-sm text-amber-600">Please select a size to add this product to your cart</div>
            )}

            {/* Delivery and Returns */}
            <div className="space-y-2 rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <span>Free delivery on orders over ₹500</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <span>1 Year warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-muted-foreground" />
                <span>30 days return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="specifications">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="specifications" className="mt-4">
            <div className="rounded-lg border">
              <table className="w-full">
                <tbody>
                  {/* {productDetail?.specifications.map((spec: any, index: number) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="px-4 py-3 font-medium">{spec.name}</td>
                      <td className="px-4 py-3">{spec.value}</td>
                    </tr>
                  ))} */}
                </tbody>
              </table>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4">
            <div className="space-y-4">
              {productDetail?.reviews?.map((review: any) => (
                <div key={review.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{review.user}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating ? "fill-primary text-primary" : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm">{review.comment}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{review.date}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {/* <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">Related Products</h2>
        {relatedProducts.length === 0 ? (
          <Loader text="Loading related products..." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </div> */}
    </div>
  )
}

// ProductCard component for related products
function ProductCard({ id, name, description, price, mrp, image, category }: RelatedProduct) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md">
      <div className="relative">
        <Link href={`/product/${id}`} className="block overflow-hidden">
          <div className="aspect-square overflow-hidden">
            <Image
              src={image || "/placeholder.svg"}
              alt={name}
              width={300}
              height={300}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
        </Link>
      </div>

      <div className="p-4">
        <h3 className="font-medium line-clamp-1">{name}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{description}</p>

        <div className="mt-2 flex items-center gap-2">
          <span className="font-medium">₹{price.toLocaleString()}</span>
          {mrp > price && <span className="text-sm text-muted-foreground line-through">₹{mrp.toLocaleString()}</span>}
        </div>
      </div>
    </div>
  )
}

// Product Page Skeleton
function ProductPageSkeleton() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Image Skeleton */}
        <div>
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted animate-pulse" />
          <div className="mt-4 grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-md bg-muted animate-pulse" />
            ))}
          </div>
        </div>

        {/* Product Details Skeleton */}
        <div className="space-y-4">
          <div className="h-8 w-3/4 rounded-md bg-muted animate-pulse" />
          <div className="h-4 w-1/4 rounded-md bg-muted animate-pulse" />
          <div className="h-20 w-full rounded-md bg-muted animate-pulse" />
          <div className="h-8 w-1/3 rounded-md bg-muted animate-pulse" />

          <div className="space-y-2">
            <div className="h-6 w-1/4 rounded-md bg-muted animate-pulse" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 w-10 rounded-full bg-muted animate-pulse" />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-6 w-1/4 rounded-md bg-muted animate-pulse" />
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-12 rounded-md bg-muted animate-pulse" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-6 rounded-md bg-muted animate-pulse" />
            ))}
          </div>

          <div className="flex gap-4">
            <div className="h-10 flex-1 rounded-md bg-muted animate-pulse" />
            <div className="h-10 w-32 rounded-md bg-muted animate-pulse" />
          </div>

          <div className="h-24 w-full rounded-md bg-muted animate-pulse" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="mt-12">
        <div className="h-10 w-64 rounded-md bg-muted animate-pulse" />
        <div className="mt-4 h-40 w-full rounded-md bg-muted animate-pulse" />
      </div>

      {/* Related Products Skeleton */}
      <div className="mt-12">
        <div className="mb-6 h-8 w-48 rounded-md bg-muted animate-pulse" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border p-4 animate-pulse">
              <div className="aspect-square w-full bg-muted" />
              <div className="mt-4 h-6 w-3/4 bg-muted" />
              <div className="mt-2 h-4 w-full bg-muted" />
              <div className="mt-2 h-4 w-1/2 bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Mock data functions
function getMockProduct(id: string): Product {
  const products: Product[] = [
    {
      id: "1",
      name: "Wireless Bluetooth Earbuds",
      description: "High-quality sound with noise cancellation and long battery life.",
      price: 1499,
      mrp: 2999,
      image: "/placeholder.svg?height=300&width=300",
      category: "electronics",
      images: [
        { url: "/placeholder.svg?height=600&width=600&text=Image+1", alt: "Earbuds front view" },
        { url: "/placeholder.svg?height=600&width=600&text=Image+2", alt: "Earbuds side view" },
        { url: "/placeholder.svg?height=600&width=600&text=Image+3", alt: "Earbuds in case" },
        {
          url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          alt: "Product video",
          isVideo: true,
        },
      ],
      colors: [
        { name: "Black", code: "#000000" },
        { name: "White", code: "#FFFFFF" },
        { name: "Blue", code: "#0000FF" },
      ],
      sizes: ["Free Size"],
      details: {
        brand: "SoundTech",
        model: "BT-500",
        color: "Black",
        connectivity: "Bluetooth 5.0",
        batteryLife: "Up to 20 hours",
        warranty: "1 Year",
      },
      specifications: [
        { name: "Bluetooth Version", value: "5.0" },
        { name: "Battery Life", value: "Up to 20 hours" },
        { name: "Charging Time", value: "1.5 hours" },
        { name: "Water Resistance", value: "IPX4" },
        { name: "Noise Cancellation", value: "Yes" },
        { name: "Microphone", value: "Built-in" },
        { name: "Weight", value: "45g" },
      ],
      reviews: [
        {
          id: 1,
          user: "John D.",
          rating: 5,
          comment: "Great sound quality and comfortable to wear.",
          date: "2023-05-10",
        },
        {
          id: 2,
          user: "Sarah M.",
          rating: 4,
          comment: "Good battery life but takes time to charge.",
          date: "2023-04-28",
        },
        { id: 3, user: "Mike P.", rating: 5, comment: "Excellent noise cancellation feature.", date: "2023-04-15" },
      ],
    },
    {
      id: "2",
      name: "Running Shoes",
      description: "Lightweight and comfortable shoes for running and workouts.",
      price: 1299,
      mrp: 2499,
      image: "/placeholder.svg?height=300&width=300",
      category: "footwear",
      images: [
        { url: "/placeholder.svg?height=600&width=600&text=Shoes+Front", alt: "Shoes front view" },
        { url: "/placeholder.svg?height=600&width=600&text=Shoes+Side", alt: "Shoes side view" },
        { url: "/placeholder.svg?height=600&width=600&text=Shoes+Back", alt: "Shoes back view" },
        {
          url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          alt: "Shoes video",
          isVideo: true,
        },
      ],
      colors: [
        { name: "Black", code: "#000000" },
        { name: "White", code: "#FFFFFF" },
        { name: "Red", code: "#FF0000" },
      ],
      sizes: [2.3, 2.4, 2.5, 2.6, 2.7, 2.8],
      details: {
        brand: "SportFit",
        model: "Runner Pro",
        material: "Mesh and synthetic",
        soleMaterial: "Rubber",
        closure: "Lace-up",
        warranty: "6 Months",
      },
      specifications: [
        { name: "Upper Material", value: "Breathable mesh" },
        { name: "Sole Material", value: "Rubber" },
        { name: "Closure Type", value: "Lace-up" },
        { name: "Arch Type", value: "Neutral" },
        { name: "Weight", value: "280g (per shoe)" },
        { name: "Terrain", value: "Road, Track" },
        { name: "Waterproof", value: "No" },
      ],
      reviews: [
        { id: 1, user: "Alex K.", rating: 5, comment: "Very comfortable for long runs.", date: "2023-05-15" },
        { id: 2, user: "Jessica T.", rating: 4, comment: "Good grip but runs slightly small.", date: "2023-05-02" },
        { id: 3, user: "David R.", rating: 5, comment: "Excellent cushioning and support.", date: "2023-04-20" },
      ],
    },
  ]

  return products.find((p) => p.id === id) || products[0]
}

function getMockRelatedProducts(): RelatedProduct[] {
  return [
    {
      id: "3",
      name: "Smart LED TV 43-inch",
      description: "Full HD display with smart features and multiple connectivity options.",
      price: 24999,
      mrp: 32999,
      image: "/placeholder.svg?height=300&width=300",
      category: "electronics",
    },
    {
      id: "8",
      name: "Smartphone Stand and Holder",
      description: "Adjustable stand for your smartphone or tablet.",
      price: 299,
      mrp: 499,
      image: "/placeholder.svg?height=300&width=300",
      category: "electronics",
    },
    {
      id: "9",
      name: "Wireless Charging Pad",
      description: "Fast wireless charging for compatible devices.",
      price: 999,
      mrp: 1499,
      image: "/placeholder.svg?height=300&width=300",
      category: "electronics",
    },
    {
      id: "10",
      name: "Bluetooth Speaker",
      description: "Portable speaker with rich sound and long battery life.",
      price: 1999,
      mrp: 2999,
      image: "/placeholder.svg?height=300&width=300",
      category: "electronics",
    },
  ]
}