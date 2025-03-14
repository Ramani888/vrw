"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import ProductCard from "@/components/product-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Mock products data
const allProducts = [
  {
    id: "1",
    name: "Wireless Bluetooth Earbuds",
    description: "High-quality sound with noise cancellation and long battery life.",
    price: 1499,
    mrp: 2999,
    image: "/placeholder.svg?height=300&width=300",
    category: "electronics",
  },
  {
    id: "2",
    name: "Men's Casual T-Shirt",
    description: "Comfortable cotton t-shirt for everyday wear.",
    price: 499,
    mrp: 999,
    image: "/placeholder.svg?height=300&width=300",
    category: "clothing",
  },
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
    id: "4",
    name: "Non-Stick Cookware Set",
    description: "Complete set of non-stick pans and pots for your kitchen.",
    price: 1999,
    mrp: 3499,
    image: "/placeholder.svg?height=300&width=300",
    category: "home",
  },
  {
    id: "5",
    name: "Women's Running Shoes",
    description: "Lightweight and comfortable shoes for running and workouts.",
    price: 1299,
    mrp: 2499,
    image: "/placeholder.svg?height=300&width=300",
    category: "clothing",
  },
  {
    id: "6",
    name: "Moisturizing Face Cream",
    description: "Hydrating face cream for all skin types.",
    price: 399,
    mrp: 599,
    image: "/placeholder.svg?height=300&width=300",
    category: "beauty",
  },
  {
    id: "7",
    name: "Stainless Steel Water Bottle",
    description: "Insulated bottle that keeps your drinks hot or cold for hours.",
    price: 699,
    mrp: 999,
    image: "/placeholder.svg?height=300&width=300",
    category: "home",
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
  {
    id: "11",
    name: "Women's Handbag",
    description: "Stylish and spacious handbag for everyday use.",
    price: 1499,
    mrp: 2499,
    image: "/placeholder.svg?height=300&width=300",
    category: "fashion",
  },
  {
    id: "12",
    name: "Men's Formal Shoes",
    description: "Classic formal shoes for professional settings.",
    price: 1999,
    mrp: 3499,
    image: "/placeholder.svg?height=300&width=300",
    category: "clothing",
  },
]

// Categories
const categories = [
  { id: "electronics", name: "Electronics" },
  { id: "clothing", name: "Clothing" },
  { id: "home", name: "Home & Kitchen" },
  { id: "beauty", name: "Beauty" },
  { id: "fashion", name: "Fashion" },
]

// Price ranges
const priceRanges = [
  { id: "under500", name: "Under ₹500", min: 0, max: 500 },
  { id: "500to1000", name: "₹500 - ₹1,000", min: 500, max: 1000 },
  { id: "1000to2000", name: "₹1,000 - ₹2,000", min: 1000, max: 2000 },
  { id: "2000to5000", name: "₹2,000 - ₹5,000", min: 2000, max: 5000 },
  { id: "above5000", name: "Above ₹5,000", min: 5000, max: 100000 },
]

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000])
  const [sortBy, setSortBy] = useState("featured")
  const [filteredProducts, setFilteredProducts] = useState(allProducts)

  // Filter products based on search, categories, and price range
  const filterProducts = () => {
    let filtered = allProducts

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) => selectedCategories.includes(product.category))
    }

    // Filter by price range
    filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Sort products
    switch (sortBy) {
      case "price-low-high":
        filtered = filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high-low":
        filtered = filtered.sort((a, b) => b.price - a.price)
        break
      case "newest":
        filtered = filtered.sort((a, b) => Number.parseInt(b.id) - Number.parseInt(a.id))
        break
      case "discount":
        filtered = filtered.sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp)
        break
      default: // featured
        filtered = filtered.sort((a, b) => Number.parseInt(a.id) - Number.parseInt(b.id))
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
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button onClick={applyFilters}>Search</Button>
            </div>
          </div>

          <div>
            <Accordion type="single" collapsible defaultValue="categories">
              <AccordionItem value="categories">
                <AccordionTrigger>Categories</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category.id}`}
                          onCheckedChange={(checked) => handleCategoryChange(category.id, checked === true)}
                        />
                        <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
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
                      defaultValue={[0, 50000]}
                      max={50000}
                      step={100}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
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
            <span className="text-sm text-muted-foreground">Showing {filteredProducts.length} products</span>
            <div className="flex items-center gap-2">
              <span className="text-sm">Sort by:</span>
              <Select
                value={sortBy}
                onValueChange={(value) => {
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
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
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

