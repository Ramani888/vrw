import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface PriceFilterBoxProps {
  title: string
  icon: string
  slug: string
}

export default function PriceFilterBox({ title, icon, slug }: PriceFilterBoxProps) {
  return (
    <Link href={`/category/${slug}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md bg-primary text-primary-foreground h-30"
        style={{
          backgroundImage: `url(background4.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 text-center h-full">
          {/* <div className="relative h-12 w-12 mb-2 sm:mb-4">
            <img src={icon || "/placeholder.svg"} alt={title} className="w-full h-full object-contain" />
          </div> */}
          <h3 className="text-base sm:text-lg font-bold text-primary">{title}</h3>
        </CardContent>
      </Card>
    </Link>
  )
}

