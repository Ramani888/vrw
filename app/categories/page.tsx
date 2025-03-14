import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

// Mock data for categories
const categories = [
  { name: "Electronics", slug: "electronics", image: "/placeholder.svg?height=200&width=200" },
  { name: "Clothing", slug: "clothing", image: "/placeholder.svg?height=200&width=200" },
  { name: "Home & Kitchen", slug: "home", image: "/placeholder.svg?height=200&width=200" },
  { name: "Beauty", slug: "beauty", image: "/placeholder.svg?height=200&width=200" },
  { name: "Toys", slug: "toys", image: "/placeholder.svg?height=200&width=200" },
  { name: "Sports", slug: "sports", image: "/placeholder.svg?height=200&width=200" },
  { name: "Books", slug: "books", image: "/placeholder.svg?height=200&width=200" },
  { name: "Grocery", slug: "grocery", image: "/placeholder.svg?height=200&width=200" },
  { name: "Jewelry", slug: "jewelry", image: "/placeholder.svg?height=200&width=200" },
  { name: "Furniture", slug: "furniture", image: "/placeholder.svg?height=200&width=200" },
  { name: "Automotive", slug: "automotive", image: "/placeholder.svg?height=200&width=200" },
  { name: "Health", slug: "health", image: "/placeholder.svg?height=200&width=200" },
]

// Price categories
const priceCategories = [
  { name: "Under ₹200", slug: "under-200", image: "/placeholder.svg?height=200&width=200&text=Under+₹200" },
  { name: "Under ₹300", slug: "under-300", image: "/placeholder.svg?height=200&width=200&text=Under+₹300" },
  { name: "Under ₹500", slug: "under-500", image: "/placeholder.svg?height=200&width=200&text=Under+₹500" },
  { name: "Under ₹1000", slug: "under-1000", image: "/placeholder.svg?height=200&width=200&text=Under+₹1000" },
]

export default function CategoriesPage() {
  return (
    <div className="w-full px-4 py-8 md:px-6 md:py-12">
      <h1 className="mb-8 text-3xl font-bold">All Categories</h1>

      <div className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Shop by Price</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {priceCategories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`}>
              <Card className="overflow-hidden transition-all hover:shadow-md">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <h3 className="text-center text-lg font-bold text-white">{category.name}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <h2 className="mb-4 text-xl font-semibold">Shop by Category</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {categories.map((category) => (
          <Link key={category.slug} href={`/category/${category.slug}`}>
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  <Image src={category.image || "/placeholder.svg"} alt={category.name} fill className="object-cover" />
                </div>
                <div className="p-3 text-center">
                  <h3 className="font-medium">{category.name}</h3>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

