"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, Trash, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

// Skeleton for wishlist item
const WishlistItemSkeleton = () => (
  <div className="group relative overflow-hidden rounded-lg border bg-background">
    <div className="absolute right-2 top-2 z-10">
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
    <div className="aspect-square overflow-hidden">
      <Skeleton className="h-full w-full" />
    </div>
    <div className="p-4">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mt-2 mb-2" />
      <Skeleton className="h-9 w-full mt-4" />
    </div>
  </div>
);

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart, loading } = useCart()

  const handleAddToCart = (item: any) => {
    addToCart(item)
  }

  return (
    <div className="w-full px-4 py-8 md:px-6 md:py-12">
      <h1 className="mb-8 text-3xl font-bold">Your Wishlist</h1>

      {loading ? (
        <div className="rounded-lg border">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-36" />
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <WishlistItemSkeleton key={item} />
              ))}
            </div>
          </div>
        </div>
      ) : wishlist?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Heart className="h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-medium">Your wishlist is empty</h2>
          <p className="mt-2 text-center text-muted-foreground">
            Save items you love for later by adding them to your wishlist.
          </p>
          <Link href="/shop">
            <Button className="mt-6">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">Saved Items ({wishlist.length})</h2>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {wishlist?.map((item) => (
                <div
                  key={item?._id}
                  className="group relative overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 z-10 bg-background/80 hover:bg-background"
                    onClick={() => removeFromWishlist(item?.productId)}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Remove from wishlist</span>
                  </Button>

                  <Link href={`/product/${item?.product?._id}`} className="block overflow-hidden">
                    <div className="aspect-square overflow-hidden">
                      <Image
                        src={item?.product?.image?.[0]?.path || "/placeholder.svg"}
                        alt={item?.product?.name}
                        width={300}
                        height={300}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  </Link>

                  <div className="p-4">
                    <h3 className="font-medium line-clamp-1">{item?.product?.name}</h3>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-medium">₹{item?.product?.price.toLocaleString()}</span>
                      {item?.product?.mrp > item?.product?.price && (
                        <span className="text-sm text-muted-foreground line-through">₹{item?.product?.mrp.toLocaleString()}</span>
                      )}
                    </div>

                    <Button className="mt-4 w-full" onClick={() => handleAddToCart(item?.product)} disabled={item?.product?.isCart}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {item?.product?.isCart ? "Added to Cart" : "Add to Cart"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

