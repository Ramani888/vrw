"use client";
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import useCategory from "../../hooks/useCategory"

// Price categories
const priceCategories = [
  { name: "Under ₹100", slug: "under-100", image: "/placeholder.svg?height=200&width=200&text=Under+₹100" },
  { name: "Under ₹200", slug: "under-200", image: "/placeholder.svg?height=200&width=200&text=Under+₹200" },
  { name: "Under ₹300", slug: "under-300", image: "/placeholder.svg?height=200&width=200&text=Under+₹300" },
  { name: "Under ₹500", slug: "under-500", image: "/placeholder.svg?height=200&width=200&text=Under+₹500" },
]

export default function CategoriesPage() {
  const {
    loading,
    categoryData
  } = useCategory();

  if (loading) return <CategoriesPageSkeleton />

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
        {categoryData?.map((category: any, index) => (
          <Link key={index} href={`/category/${category?._id}`}>
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  <Image src={category?.imagePath || "/placeholder.svg"} alt={category?.name} fill className="object-cover" />
                </div>
                <div className="p-3 text-center">
                  <h3 className="font-medium">{category?.name}</h3>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

function CategoriesPageSkeleton() {
  return (
    <div className="w-full px-4 py-8 md:px-6 md:py-12">
      {/* Page Title Skeleton */}
      <div className="mb-8 h-8 w-48 bg-muted animate-pulse rounded-md"></div>

      {/* Shop by Price Skeleton */}
      <div className="mb-10">
        <div className="mb-4 h-6 w-40 bg-muted animate-pulse rounded-md"></div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-70 bg-muted animate-pulse rounded-md"></div>
          ))}
        </div>
      </div>

      {/* Shop by Category Skeleton */}
      <div className="mb-4 h-6 w-40 bg-muted animate-pulse rounded-md"></div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="rounded-lg border p-4 animate-pulse">
            <div className="aspect-square w-full bg-muted rounded-md"></div>
            <div className="mt-4 h-6 w-3/4 bg-muted rounded-md"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

