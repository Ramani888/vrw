"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import ProductCard from "@/components/product-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import useShop from "../../hooks/useShop"

// Price ranges
const priceRanges = [
  { id: "under100", name: "Under ₹100", min: 0, max: 100 },
  { id: "100to2000", name: "₹100 - ₹200", min: 100, max: 200 },
  { id: "200to300", name: "₹200 - ₹300", min: 200, max: 300 },
  { id: "300to400", name: "₹300 - ₹400", min: 300, max: 400 },
  { id: "400to500", name: "₹300 - ₹400", min: 400, max: 500 },
]

export default function ShopPage() {
  const {
    loading,
    productData,
    categoryData
  } = useShop();
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [sortBy, setSortBy] = useState("featured")
  const [filteredProducts, setFilteredProducts] = useState(productData)

  // Filter products based on search, categories, and price range
  const filterProducts = () => {
    let filtered = productData

    // Filter by search query
    if (searchQuery) {
      filtered = filtered?.filter(
        (product) =>
          product?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
          product?.description?.toLowerCase()?.includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered?.filter((product) => selectedCategories?.includes(product?.categoryId))
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
        filtered = filtered.sort((a, b) => (b?.mrp - b?.price) / b?.mrp - (a?.mrp - a?.price) / a?.mrp)
        break
      default: // featured
        filtered = filtered.sort((a, b) => Number.parseInt(a?._id) - Number.parseInt(b?._id))
    }

    setFilteredProducts(filtered)
  }

  // Handle category selection
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, categoryId])
    } else {
      setSelectedCategories((prev) => prev.filter((id) => id !== categoryId))
    }
  }

  // Handle price range selection
  const handlePriceRangeClick = (min: number, max: number) => {
    setPriceRange([min, max])
  }

  // Apply filters when search, categories, price range, or sort changes
  const applyFilters = () => {
    filterProducts()
  }

  useEffect(() => {
    setFilteredProducts(productData);
  }, [productData])

  useEffect(() => {
    applyFilters();
  }, [searchQuery])

  if (loading) {
    return <ShopPageSkeleton />
  }

  return (
    <div className="w-full px-4 py-8 md:px-6 md:py-12">
      <h1 className="mb-8 text-3xl font-bold">Shop All Products</h1>

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
              {/* <Button onClick={applyFilters}>Search</Button> */}
            </div>
          </div>

          <div>
            <Accordion type="multiple" defaultValue={["categories"]}>
              <AccordionItem value="categories">
                <AccordionTrigger>Categories</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {categoryData?.map((category: any, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category?._id}`}
                          onCheckedChange={(checked: any) => handleCategoryChange(category?._id, checked === true)}
                        />
                        <Label htmlFor={`category-${category?._id}`}>{category?.name}</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

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
            {filteredProducts?.map((product, index) => (
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

function ShopPageSkeleton() {
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

