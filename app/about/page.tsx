import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Truck, ShieldCheck, RotateCcw, HeadphonesIcon, MapPin, Mail, Phone } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="w-full px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-3xl font-bold md:text-4xl">About ShopEase</h1>
        <p className="mt-4 text-muted-foreground">Your one-stop shopping destination for all your needs</p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <Image
            src="/placeholder.svg?height=400&width=600&text=Our+Story"
            alt="Our Story"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-bold">Our Story</h2>
          <p className="mt-4 text-muted-foreground">
            Founded in 2020, ShopEase started with a simple mission: to make online shopping easy, affordable, and
            accessible to everyone. What began as a small startup has now grown into a trusted e-commerce platform
            serving thousands of customers across the country.
          </p>
          <p className="mt-4 text-muted-foreground">
            Our team is dedicated to curating high-quality products across various categories, ensuring that our
            customers have access to the best items at competitive prices. We believe in building lasting relationships
            with our customers through exceptional service and a seamless shopping experience.
          </p>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-center text-2xl font-bold">Our Values</h2>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-medium">Quality Assurance</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We carefully select and verify all products to ensure the highest quality standards.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-medium">Fast Delivery</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We partner with reliable logistics providers to ensure timely delivery of your orders.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <HeadphonesIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-medium">Customer Support</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Our dedicated support team is always ready to assist you with any queries or concerns.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <RotateCcw className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-medium">Easy Returns</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We offer hassle-free returns and exchanges to ensure your complete satisfaction.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-center text-2xl font-bold">Meet Our Team</h2>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: "John Smith",
              position: "Founder & CEO",
              image: "/placeholder.svg?height=300&width=300&text=John",
            },
            {
              name: "Sarah Johnson",
              position: "Chief Operating Officer",
              image: "/placeholder.svg?height=300&width=300&text=Sarah",
            },
            {
              name: "Michael Brown",
              position: "Head of Product",
              image: "/placeholder.svg?height=300&width=300&text=Michael",
            },
          ].map((member) => (
            <Card key={member.name}>
              <CardContent className="p-6">
                <div className="aspect-square overflow-hidden rounded-full">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="font-medium">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.position}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-center text-2xl font-bold">Contact Us</h2>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-medium">Address</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                123 Commerce Street, Business District, City - 123456
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-medium">Email</h3>
              <p className="mt-2 text-sm text-muted-foreground">support@shopease.com</p>
              <p className="mt-1 text-sm text-muted-foreground">info@shopease.com</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-medium">Phone</h3>
              <p className="mt-2 text-sm text-muted-foreground">+1 (123) 456-7890</p>
              <p className="mt-1 text-sm text-muted-foreground">+1 (987) 654-3210</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-center">
          <Button size="lg">Get in Touch</Button>
        </div>
      </div>
    </div>
  )
}

