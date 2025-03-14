import Image from "next/image"
import Link from "next/link"

interface CategoryCircleProps {
  name: string
  image: string
  slug: string
}

export default function CategoryCircle({ name, image, slug }: CategoryCircleProps) {
  return (
    <Link href={`/category/${slug}`} className="flex flex-col items-center gap-2 transition-transform hover:scale-105">
      <div className="relative h-20 w-20 overflow-hidden rounded-full border sm:h-24 sm:w-24">
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <span className="text-center text-sm font-medium">{name}</span>
    </Link>
  )
}

