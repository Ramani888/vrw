"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import ProductCard from "@/components/product-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import useCategory from "../../../hooks/useCategory"

// Price ranges
const priceRanges = [
  { id: "under500", name: "Under ₹500", min: 0, max: 500 },
  { id: "500to1000", name: "₹500 - ₹1,000", min: 500, max: 1000 },
  { id: "1000to2000", name: "₹1,000 - ₹2,000", min: 1000, max: 2000 },
  { id: "2000to5000", name: "₹2,000 - ₹5,000", min: 2000, max: 5000 },
  { id: "above5000", name: "Above ₹5,000", min: 5000, max: 100000 },
]

// Special categories for price filters
const priceCategories = {
  "under-100": { min: 0, max: 100 },
  "under-200": { min: 0, max: 200 },
  "under-300": { min: 0, max: 300 },
  "under-500": { min: 0, max: 500 },
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const {
    categoryData,
    loading,
    productData
  } = useCategory();
  const { slug } = params
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [sortBy, setSortBy] = useState("featured")
  const [filteredProducts, setFilteredProducts] = useState<typeof productData>([])
  const [categoryName, setCategoryName] = useState("")

  useEffect(() => {
    // Set initial category name
    const category: any = categoryData?.find((cat: any) => cat?._id === slug)
    if (category) {
      setCategoryName(category?.name)
    } else if (slug.startsWith("under-")) {
      setCategoryName(`Products ${slug.replace("-", " ₹")}`)
    } else {
      setCategoryName("Products")
    }

    // Set initial price range for special price categories
    if (slug in priceCategories) {
      const { min, max } = priceCategories[slug as keyof typeof priceCategories]
      setPriceRange([min, max])
    }

    // Initial filtering
    filterProducts()
  }, [slug, categoryData])

  // Filter products based on category, search, and price range
  const filterProducts = () => {
    let filtered = productData

    // Filter by category
    if (slug in priceCategories) {
      const { min, max } = priceCategories[slug as keyof typeof priceCategories]
      filtered = filtered?.filter((product) => product?.price >= min && product?.price <= max)
    } else if (categoryData?.some((cat: any) => cat?._id === slug)) {
      filtered = filtered.filter((product) => product?.categoryId === slug)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered?.filter(
        (product) =>
          product?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
          product?.description?.toLowerCase()?.includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by price range
    filtered = filtered?.filter((product) => product?.price >= priceRange[0] && product?.price <= priceRange[1])

    // Sort products
    switch (sortBy) {
      case "price-low-high":
        filtered = filtered?.sort((a, b) => a?.price - b?.price)
        break
      case "price-high-low":
        filtered = filtered?.sort((a, b) => b?.price - a?.price)
        break
      case "newest":
        filtered = filtered?.sort((a, b) => Number.parseInt(b?._id) - Number.parseInt(a?._id))
        break
      case "discount":
        filtered = filtered?.sort((a, b) => (b?.mrp - b?.price) / b?.mrp - (a?.mrp - a?.price) / a?.mrp)
        break
      default: // featured
        filtered = filtered?.sort((a, b) => Number.parseInt(a?._id) - Number.parseInt(b?._id))
    }

    setFilteredProducts(filtered)
  }

  // Handle price range selection
  const handlePriceRangeClick = (min: number, max: number) => {
    setPriceRange([min, max])
  }

  // Apply filters when search, price range, or sort changes
  const applyFilters = () => {
    filterProducts()
  }

  useEffect(() => {
    filterProducts();
  }, [productData])

  if (loading) {
    return <CategoryPageSkeleton />
  }

  return (
    <div className="w-full px-4 py-8 md:px-6 md:py-12">
      <h1 className="mb-8 text-3xl font-bold">{categoryName}</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        {/* Filters Sidebar */}
        <div className="space-y-6">
          <div>
            <h3 className="mb-4 text-lg font-medium">Search</h3>
            <div className="flex gap-2">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
              />
              <Button onClick={applyFilters}>Search</Button>
            </div>
          </div>

          <div>
            <Accordion type="single" collapsible defaultValue="price">
              <AccordionItem value="price">
                <AccordionTrigger>Price Range</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>₹{priceRange[0].toLocaleString()}</span>
                      <span>₹{priceRange[1].toLocaleString()}</span>
                    </div>
                    <Slider
                      defaultValue={[0, 5000]}
                      max={5000}
                      step={100}
                      value={priceRange}
                      onValueChange={(value: any) => setPriceRange(value as [number, number])}
                    />
                    <div className="space-y-2 pt-2">
                      {priceRanges.map((range) => (
                        <Button
                          key={range.id}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => handlePriceRangeClick(range.min, range.max)}
                        >
                          {range.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <Button className="w-full" onClick={applyFilters}>
            Apply Filters
          </Button>
        </div>

        {/* Products Grid */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Showing {filteredProducts?.length} products</span>
            <div className="flex items-center gap-2">
              <span className="text-sm">Sort by:</span>
              <Select
                value={sortBy}
                onValueChange={(value: any) => {
                  setSortBy(value)
                  setTimeout(applyFilters, 0)
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="discount">Discount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="mt-12 text-center">
              <h3 className="text-lg font-medium">No products found</h3>
              <p className="mt-2 text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CategoryPageSkeleton() {
  return (
    <div className="w-full px-4 py-8 md:px-6 md:py-12">
      {/* Page Title Skeleton */}
      <div className="mb-8 h-8 w-1/3 bg-muted animate-pulse rounded-md"></div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        {/* Filters Sidebar Skeleton */}
        <div className="space-y-6">
          {/* Search Box Skeleton */}
          <div>
            <div className="mb-4 h-6 w-24 bg-muted animate-pulse rounded-md"></div>
            <div className="flex gap-2">
              <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>
              <div className="h-10 w-24 bg-muted animate-pulse rounded-md"></div>
            </div>
          </div>

          {/* Filters Skeleton */}
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-6 w-32 bg-muted animate-pulse rounded-md"></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-muted animate-pulse rounded-sm"></div>
                      <div className="h-4 w-20 bg-muted animate-pulse rounded-md"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Apply Filters Button Skeleton */}
          <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>
        </div>

        {/* Products Grid Skeleton */}
        <div>
          {/* Sorting & Product Count Skeleton */}
          <div className="mb-6 flex items-center justify-between">
            <div className="h-4 w-32 bg-muted animate-pulse rounded-md"></div>
            <div className="h-8 w-48 bg-muted animate-pulse rounded-md"></div>
          </div>

          {/* Product Cards Skeleton */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="rounded-lg border p-4 animate-pulse">
                <div className="aspect-square w-full bg-muted" />
                <div className="mt-4 h-6 w-3/4 bg-muted" />
                <div className="mt-2 h-4 w-full bg-muted" />
                <div className="mt-2 h-4 w-1/2 bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

