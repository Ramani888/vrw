"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Carousel from "@/components/carousel"
import ProductCard from "@/components/product-card"
import { useCart } from "@/components/cart-provider"

// Mock product data
const products = [
  {
    id: "1",
    name: "Wireless Bluetooth Earbuds",
    description: "High-quality sound with noise cancellation and long battery life.",
    price: 1499,
    mrp: 2999,
    image: "/placeholder.svg?height=300&width=300",
    category: "electronics",
    images: [
      "/placeholder.svg?height=600&width=600&text=Image+1",
      "/placeholder.svg?height=600&width=600&text=Image+2",
      "/placeholder.svg?height=600&width=600&text=Image+3",
      "/placeholder.svg?height=600&width=600&text=Image+4",
    ],
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
      { id: 1, user: "John D.", rating: 5, comment: "Great sound quality and comfortable to wear." },
      { id: 2, user: "Sarah M.", rating: 4, comment: "Good battery life but takes time to charge." },
      { id: 3, user: "Mike P.", rating: 5, comment: "Excellent noise cancellation feature." },
    ],
  },
]

// Mock related products
const relatedProducts = [
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

export default function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params
  const product = products.find((p) => p.id === id) || products[0]
  const [quantity, setQuantity] = useState(1)

  const { addToCart, addToWishlist, isInWishlist, isInCart } = useCart()
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist(product.id))

  const handleAddToWishlist = () => {
    addToWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      mrp: product.mrp,
      image: product.image,
    })
    setIsWishlisted(true)
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      mrp: product.mrp,
      image: product.image,
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

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100)

  return (
    <div className="w-full px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Images */}
        <div className="md:sticky md:top-20">
          <Carousel>
            {product.images.map((image, index) => (
              <div key={index} className="relative aspect-square w-full overflow-hidden rounded-lg">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </Carousel>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <div key={index} className="relative aspect-square overflow-hidden rounded-md border">
                <Image src={image || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">{product.name}</h1>

          <div className="mt-2 flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${star <= 4 ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({product.reviews.length} reviews)</span>
          </div>

          <div className="mt-4">
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-3xl font-bold">₹{product.price.toLocaleString()}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-lg text-muted-foreground line-through">₹{product.mrp.toLocaleString()}</span>
                <span className="rounded-md bg-green-100 px-2 py-1 text-sm font-medium text-green-800">
                  {discount}% off
                </span>
              </>
            )}
          </div>

          <div className="mt-6 space-y-4">
            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {Object.entries(product.details).map(([key, value]) => (
                <div key={key}>
                  <span className="text-muted-foreground">{key}: </span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
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
                variant={isInCart(product.id) ? "secondary" : "default"}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {isInCart(product.id) ? "Added to Cart" : "Add to Cart"}
              </Button>
              <Button variant="outline" onClick={handleAddToWishlist} disabled={isWishlisted}>
                <Heart className={`mr-2 h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </Button>
            </div>

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
                  {product.specifications.map((spec, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="px-4 py-3 font-medium">{spec.name}</td>
                      <td className="px-4 py-3">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4">
            <div className="space-y-4">
              {product.reviews.map((review) => (
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
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">Related Products</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </div>
  )
}

