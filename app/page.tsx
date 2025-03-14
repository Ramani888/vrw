import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Carousel from "@/components/carousel"
import CategoryCircle from "@/components/category-circle"
import ProductCard from "@/components/product-card"
import PriceFilterBox from "@/components/price-filter-box"

// Mock data for categories
const categories = [
  { name: "Electronics", slug: "electronics", image: "/placeholder.svg?height=100&width=100" },
  { name: "Clothing", slug: "clothing", image: "/placeholder.svg?height=100&width=100" },
  { name: "Home & Kitchen", slug: "home", image: "/placeholder.svg?height=100&width=100" },
  { name: "Beauty", slug: "beauty", image: "/placeholder.svg?height=100&width=100" },
  { name: "Toys", slug: "toys", image: "/placeholder.svg?height=100&width=100" },
  { name: "Sports", slug: "sports", image: "/placeholder.svg?height=100&width=100" },
  { name: "Books", slug: "books", image: "/placeholder.svg?height=100&width=100" },
  { name: "Grocery", slug: "grocery", image: "/placeholder.svg?height=100&width=100" },
]

// Mock data for products
const products = [
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
]

// Filter products by price range
const under100 = products.filter((product) => product.price < 200)
const under200 = products.filter((product) => product.price < 300)
const under300 = products.filter((product) => product.price < 500)
const under500 = products.filter((product) => product.price < 1000)

export default function Home() {
  return (
    // container px-4 md:px-6
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero Banner Carousel */}
      <section className="w-full">
        <Carousel>
          {[1, 2, 3].map((item) => (
            <div key={item} className="relative h-[300px] w-full sm:h-[400px] md:h-[500px]">
              <Image
                src={`/placeholder.svg?height=500&width=1200&text=Banner+${item}`}
                alt={`Banner ${item}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 p-4 text-center text-white">
                <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">Special Offer {item}</h2>
                <p className="mt-2 max-w-md text-sm sm:text-base md:text-lg">
                  Discover amazing deals on our latest products
                </p>
                <Button className="mt-4">Shop Now</Button>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* Categories */}
      <section className="w-full px-4 md:px-6">
        <h2 className="mb-6 text-2xl font-bold">Shop by Category</h2>
        <div className="flex overflow-x-auto pb-4 space-x-4 -mx-4 px-4">
          {categories.map((category) => (
            <div key={category.slug} className="flex-shrink-0">
              <CategoryCircle name={category.name} image={category.image} slug={category.slug} />
            </div>
          ))}
        </div>
      </section>

      {/* Price Filter Boxes */}
      <section className="w-full px-4 md:px-6">
        <h2 className="mb-6 text-2xl font-bold">Shop by Price</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <PriceFilterBox title="UNDER 200" icon="/placeholder.svg?height=64&width=64&text=₹200" slug="under-200" />
          <PriceFilterBox title="UNDER 300" icon="/placeholder.svg?height=64&width=64&text=₹300" slug="under-300" />
          <PriceFilterBox title="UNDER 500" icon="/placeholder.svg?height=64&width=64&text=₹500" slug="under-500" />
          <PriceFilterBox title="UNDER 1000" icon="/placeholder.svg?height=64&width=64&text=₹1000" slug="under-1000" />
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="w-full px-4 md:px-6">
        <Carousel>
          {[1, 2, 3].map((item) => (
            <div key={item} className="relative h-[150px] w-full sm:h-[200px]">
              <Image
                src={`/placeholder.svg?height=200&width=1200&text=Promotion+${item}`}
                alt={`Promotion ${item}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-start justify-center bg-black/20 p-6 text-white">
                <h3 className="text-xl font-bold sm:text-2xl">Special Offer</h3>
                <p className="mt-2 max-w-md text-sm sm:text-base">Up to 50% off on selected items</p>
                <Button className="mt-4" variant="outline">
                  View Offers
                </Button>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* Price Range Sections */}
      <section className="w-full px-4 md:px-6">
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Under ₹200</h2>
            <Link href="/category/under-200" className="text-sm font-medium text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {under100.slice(0, 4).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Under ₹300</h2>
            <Link href="/category/under-300" className="text-sm font-medium text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {under200.slice(0, 4).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Under ₹500</h2>
            <Link href="/category/under-500" className="text-sm font-medium text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {under300.slice(0, 4).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Under ₹1,000</h2>
            <Link href="/category/under-1000" className="text-sm font-medium text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {under500.slice(0, 4).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}