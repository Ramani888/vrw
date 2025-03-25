import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.vr_fashion"
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(playStoreUrl)}`
  return (
    <footer className="bg-muted py-12">
      <div className="w-full px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-medium">VR Fashion</h3>
            <p className="mt-2 text-sm text-muted-foreground">We are your one-stop shop for all your e-commerce needs. Quality products, great prices, and excellent customer service.</p>
            {/* <div className="mt-4 flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div> */}
          </div>
          <div>
            <h3 className="text-lg font-medium">Shop</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link href="" className="text-muted-foreground hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-muted-foreground hover:text-foreground">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-muted-foreground hover:text-foreground">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-muted-foreground hover:text-foreground">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          {/* <div>
            <h3 className="text-lg font-medium">Account</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link href="/login" className="text-muted-foreground hover:text-foreground">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-muted-foreground hover:text-foreground">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-muted-foreground hover:text-foreground">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-muted-foreground hover:text-foreground">
                  Cart
                </Link>
              </li>
            </ul>
          </div> */}
          <div>
            <h3 className="text-lg font-medium">Contact Us</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="text-muted-foreground">
                <span className="font-medium">Email:</span> vrfashionjewellery0044@gmail.com
              </li>
              <li className="text-muted-foreground">
                <span className="font-medium">Phone:</span> +91 8141851456
              </li>
              <li className="text-muted-foreground">
                <span className="font-medium">Address:</span> A-34, 2nd Floor Laxmidhara Complex, Baroda Pristage, Varachha Road, Surat - 395006, Gujrat, India.
              </li>
            </ul>
          </div>
          {/* <div>
            <h3 className="text-lg font-medium">Information</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div> */}
          <div>
            <h3 className="text-lg font-medium">Get Our App</h3>
            <div className="mt-2 flex flex-col items-flex-start">
              <div className="p-2 rounded-lg">
                <Image src={qrCodeUrl || '/qr-code.png'} alt="Download our app" width={150} height={150} className="h-auto w-auto" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground text-left">
                Scan the QR code to download our mobile app
              </p>
              {/* <div className="mt-3 flex space-x-3">
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <Image
                    src="/app-store-badge.png"
                    alt="Download on App Store"
                    width={120}
                    height={40}
                    className="h-auto w-auto"
                  />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <Image
                    src="/google-play-badge.png"
                    alt="Get it on Google Play"
                    width={120}
                    height={40}
                    className="h-auto w-auto"
                  />
                </Link>
              </div> */}
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} VR Fashion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

