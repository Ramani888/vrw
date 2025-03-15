"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "./cart-provider"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  _id: string
  name: string
  description: string
  price: number
  mrp: number
  image: {_id: string, path: string}[]
  category: string
}

export default function ProductCard({ _id, name, description, price, mrp, image, category }: ProductCardProps) {
  const { addToCart, addToWishlist, isInWishlist, isInCart } = useCart()
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist(_id))
  const [isAddedToCart, setIsAddedToCart] = useState(isInCart(_id))

  const discount = Math.round(((mrp - price) / mrp) * 100)

  const handleAddToWishlist = () => {
    addToWishlist({ id: _id, name, price, mrp, image: image[0]?.path })
    setIsWishlisted(true)
  }

  const handleAddToCart = () => {
    addToCart({ id: _id, name, price, mrp, image: image[0]?.path })
    setIsAddedToCart(true)
  }

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md">
      {discount > 0 && <Badge className="absolute left-2 top-2 z-10">{discount}% OFF</Badge>}

      <div className="relative">
        <Link href={`/product/${_id}`} className="block overflow-hidden">
          <div className="aspect-square overflow-hidden">
            <Image
              src={image[0]?.path || "/placeholder.svg"}
              alt={name}
              width={300}
              height={300}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Product action buttons positioned vertically in top right */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 z-20">
          <Button
            variant="secondary"
            size="icon"
            onClick={handleAddToCart}
            className={`rounded-full shadow-md ${isAddedToCart ? "bg-primary text-primary-foreground" : "bg-white"}`}
          >
            <ShoppingCart className={`h-4 w-4 ${isAddedToCart ? "fill-primary-foreground" : ""}`} />
            <span className="sr-only">Add to Cart</span>
          </Button>

          <Link href={`/product/${_id}`}>
            <Button variant="secondary" size="icon" className="rounded-full shadow-md bg-white">
              <Eye className="h-4 w-4" />
              <span className="sr-only">View Details</span>
            </Button>
          </Link>

          <Button
            variant="secondary"
            size="icon"
            className="rounded-full shadow-md bg-white"
            onClick={handleAddToWishlist}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        </div>
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

