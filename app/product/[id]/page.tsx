"use client"

import { useState, useRef, useEffect, use } from "react"
import Image from "next/image"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/components/cart-provider"
import { Badge } from "@/components/ui/badge"
import { Loader } from "@/components/ui/loader"
import { serverGetProductByCategoryId, serverGetProductById } from "@/services/serverApi"
import ProductCard from "@/components/product-card"
import { useAuth } from "@/components/auth-provider"

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

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth()
  // const { id } = params
  const { id } = use(params);
  const [loading, setLoading] = useState(true)
  const [productDetail, setProductDetail] = useState<any>({})
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string | number | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const { addToCart, addToWishlist } = useCart()

  const getProductById = async (noLoading?: boolean) => {
    try {
      if (!noLoading) setLoading(true)
      
      const res = await serverGetProductById(id, user?._id?.toString())
      if (res?.data?.[0]) {
        setProductDetail(res.data[0])
        
        // Fetch related products based on category
        if (res.data[0]?.categoryId) {
          const relatedData = await serverGetProductByCategoryId(
            res.data[0].categoryId, 
            user?._id?.toString()
          )
          setRelatedProducts(relatedData?.data || [])
        }
      }
    } catch (error) {
      console.error("Failed to fetch product:", error)
      setProductDetail({})
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getProductById()
    }
  }, [id, user])

  // Handle free size selection automatically
  useEffect(() => {
    if (productDetail?.size?.length === 1 && productDetail?.size?.[0] === "Free Size") {
      setSelectedSize(productDetail.size[0])
    }
  }, [productDetail])

  const handleAddToWishlist = () => {
    if (!productDetail) return
    
    // Add to wishlist
    addToWishlist(productDetail)
    
    // Update local state immediately
    setProductDetail((prevProduct: any) => ({
      ...prevProduct,
      isWishlist: true
    }))
  }

  const handleAddToCart = () => {
    if (!productDetail) return

    if (!selectedSize && productDetail?.size?.length > 0 && productDetail?.size?.[0] !== "Free Size") {
      alert("Please select a size")
      return
    }

    // Add to cart with quantity
    addToCart({...productDetail, quantity})
    
    // Update local state immediately
    setProductDetail((prevProduct: any) => ({
      ...prevProduct,
      isCart: true
    }))
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

  const discount = Math.round(((productDetail?.mrp - productDetail?.price) / productDetail?.mrp) * 100)
  const imagesWithVideo = [
    ...productDetail?.image,
    ...(productDetail?.videoPath ? [{ path: productDetail.videoPath, isVideo: true }] : []),
  ];
  const currentMedia = imagesWithVideo[currentImageIndex];
  const isVideo = currentMedia?.isVideo

  return (
    <div className="w-full px-4 py-8 md:px-6 md:py-12">
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
            {imagesWithVideo?.map((image, index) => (
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
            <div>
              <h3 className="mb-2 font-medium">Color: {productDetail?.productColorName}</h3>
              <div className="flex flex-wrap gap-2">
                  <div
                    className={`relative h-10 w-10 cursor-pointer rounded-full border-2 border-muted`}
                    style={{ backgroundColor: productDetail?.productColorCode }}
                  >
                  </div>
              </div>
            </div>

            {/* Size Selection */}
            {productDetail?.size?.length > 0 && productDetail?.size?.[0] !== "Free Size" && (
              <div>
                <div className="flex justify-between">
                  <h3 className="mb-2 font-medium">Size</h3>
                  <button className="text-sm text-primary">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {productDetail?.size?.map((sizeItem: any) => (
                    <div
                      key={sizeItem?.toString()}
                      className={`flex h-10 min-w-[2.5rem] cursor-pointer items-center justify-center rounded-md border px-3 ${
                        selectedSize === sizeItem
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input hover:border-primary"
                      }`}
                      onClick={() => setSelectedSize(sizeItem)}
                    >
                      {sizeItem}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Free Size Badge */}
            {productDetail?.size?.length === 1 && productDetail?.size?.[0] === "Free Size" && (
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">
                  Free Size
                </Badge>
                <span className="text-sm text-muted-foreground">One size fits all</span>
              </div>
            )}

            {/* Product Details */}
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Brand: </span>
                <span className="font-medium">{productDetail?.productBrandName ?? 'N/A'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Code: </span>
                <span className="font-medium">{productDetail?.code ?? 'N/A'}</span>
              </div>
            </div>

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
                variant={productDetail?.isCart ? "secondary" : "default"}
                disabled={productDetail?.size?.length > 0 && productDetail?.size?.[0] !== "Free Size" && !selectedSize || productDetail?.isCart}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {productDetail?.isCart ? "Added to Cart" : "Add to Cart"}
              </Button>
              <Button variant="outline" onClick={handleAddToWishlist} disabled={productDetail?.isWishlist}>
                <Heart className={`mr-2 h-4 w-4 ${productDetail?.isWishlist ? "fill-red-500 text-red-500" : ""}`} />
                {productDetail?.isWishlist ? "Wishlisted" : "Add to Wishlist"}
              </Button>
            </div>

            {/* Size selection warning */}
            {productDetail?.size?.length > 0 && productDetail?.size?.[0] !== "Free Size" && !selectedSize && (
              <div className="text-sm text-amber-600">Please select a size to add this product to your cart</div>
            )}
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="specifications">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="description">Description</TabsTrigger>
          </TabsList>
          <TabsContent value="specifications" className="mt-4">
            <div className="rounded-lg border">
              <table className="w-full">
                <tbody>
                  <tr className="bg-muted/50">
                    <td className="px-4 py-3 font-medium">Code</td>
                    <td className="px-4 py-3">{productDetail?.code ?? 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Base Metal</td>
                    <td className="px-4 py-3">{productDetail?.productBaseMetalName ?? 'N/A'}</td>
                  </tr>
                  <tr className="bg-muted/50">
                    <td className="px-4 py-3 font-medium">Brand</td>
                    <td className="px-4 py-3">{productDetail?.productBrandName ?? 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Color</td>
                    <td className="px-4 py-3">{productDetail?.productColorName ?? 'N/A'}</td>
                  </tr>
                  <tr className="bg-muted/50">
                    <td className="px-4 py-3 font-medium">Occasion</td>
                    <td className="px-4 py-3">{productDetail?.productOccasionName ?? 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Plating</td>
                    <td className="px-4 py-3">{productDetail?.productPlatingName ?? 'N/A'}</td>
                  </tr>
                  <tr className="bg-muted/50">
                    <td className="px-4 py-3 font-medium">Stone Type</td>
                    <td className="px-4 py-3">{productDetail?.productStoneTypeName ?? 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Trend</td>
                    <td className="px-4 py-3">{productDetail?.productTrendName ?? 'N/A'}</td>
                  </tr>
                  <tr className="bg-muted/50">
                    <td className="px-4 py-3 font-medium">Weight</td>
                    <td className="px-4 py-3">{productDetail?.weight ?? 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>
          <TabsContent value="description" className="mt-4">
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <p className="text-sm">{productDetail?.description}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">Related Products</h2>
        {relatedProducts?.length === 0 ? (
          <Loader text="Loading related products..." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {relatedProducts?.map((product: any) => (
              <ProductCard key={product?._id ?? ''} product={product} getData={(noLoading) => getProductById(noLoading)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Product Page Skeleton
function ProductPageSkeleton() {
  return (
    <div className="w-full px-4 py-8 md:px-6 md:py-12">
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