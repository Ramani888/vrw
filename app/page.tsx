"use client";
import Image from "next/image"
import Carousel from "@/components/carousel"
import CategoryCircle from "@/components/category-circle"
import ProductCard from "@/components/product-card"
import PriceFilterBox from "@/components/price-filter-box"
import useHome from "../hooks/useHome";

export default function Home() {
  const {
    bannerData,
    loading,
    categoryData,
    adsPosterData,
    pramotionProductData
  } = useHome();

  if (loading) {
    return <SkeletonLoader />
  }

  return (
    // container px-4 md:px-6
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero Banner Carousel */}
      <section className="w-full">
        <Carousel>
          {bannerData?.map((item: any, index) => (
            <div key={index} className="relative h-[300px] w-full sm:h-[400px] md:h-[500px]">
              <Image
                src={item?.imagePath}
                alt={`Banner ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </Carousel>
      </section>

      {/* Categories */}
      <section className="w-full px-4 md:px-6">
        <h2 className="mb-6 text-2xl font-bold">Shop by Category</h2>
        <div className="flex overflow-x-auto pb-4 space-x-4 -mx-4 px-4">
          {categoryData?.map((category: any, index) => (
            <div key={index} className="flex-shrink-0 w-25">
              <CategoryCircle name={category?.name} image={category?.imagePath} slug={category?._id} />
            </div>
          ))}
        </div>
      </section>

      {/* Price Filter Boxes */}
      <section className="w-full px-4 md:px-6">
        <h2 className="mb-6 text-2xl font-bold">Shop by Price</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <PriceFilterBox title="UNDER 100" icon="/placeholder.svg?height=64&width=64&text=₹100" slug="under-100" />
          <PriceFilterBox title="UNDER 200" icon="/placeholder.svg?height=64&width=64&text=₹200" slug="under-200" />
          <PriceFilterBox title="UNDER 300" icon="/placeholder.svg?height=64&width=64&text=₹300" slug="under-300" />
          <PriceFilterBox title="UNDER 500" icon="/placeholder.svg?height=64&width=64&text=₹500" slug="under-500" />
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="w-full px-4 md:px-6">
        <Carousel>
          {adsPosterData?.map((item, index) => (
            <div key={index} className="relative h-[150px] w-full sm:h-[200px]">
              <Image
                src={item?.imagePath}
                alt={`Promotion ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </Carousel>
      </section>

      {/* Price Range Sections */}
      <section className="w-full px-4 md:px-6">
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {pramotionProductData?.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function SkeletonLoader() {
  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero Banner Skeleton */}
      <div className="w-full">
        <div className="relative h-[300px] w-full sm:h-[400px] md:h-[500px] bg-muted animate-pulse rounded-md"></div>
      </div>

      {/* Categories Skeleton */}
      <div className="w-full px-4 md:px-6">
        <h2 className="mb-6 text-2xl font-bold bg-muted animate-pulse w-40 h-6 rounded-md"></h2>
        <div className="flex overflow-x-auto pb-4 space-x-4 -mx-4 px-4">
          {[...Array(15)].map((_, index) => (
            <div key={index} className="flex-shrink-0 w-24 h-24 bg-muted animate-pulse rounded-full"></div>
          ))}
        </div>
      </div>

      {/* Price Filter Boxes Skeleton */}
      <div className="w-full px-4 md:px-6">
        <h2 className="mb-6 text-2xl font-bold bg-muted animate-pulse w-40 h-6 rounded-md"></h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-40 bg-muted animate-pulse rounded-md"></div>
          ))}
        </div>
      </div>

      {/* Promotional Banners Skeleton */}
      <div className="w-full px-4 md:px-6">
        <div className="relative h-[150px] w-full sm:h-[200px] bg-muted animate-pulse rounded-md"></div>
      </div>

      {/* Product Cards Skeleton */}
      <div className="w-full px-4 md:px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
  );
};