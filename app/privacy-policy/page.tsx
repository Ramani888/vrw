"use client"

import { Card, CardContent } from "@/components/ui/card"

export default function PoliciesPage() {
  return (
    <div className="w-full px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-3xl font-bold md:text-4xl">Privacy Policy</h1>
        <p className="mt-4 text-muted-foreground">
          Your privacy is important to us. Please review our privacy practices below.
        </p>
      </div>

      <div className="mt-12">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground space-y-4">
              <p><strong>Privacy Policy:</strong> Your privacy is important to us. This policy explains how we collect, use, and safeguard your personal information.</p>
              <p><strong>1. Information We Collect:</strong> Name, contact details, shipping address, and payment information. We also collect browsing behavior through cookies to improve our website experience.</p>
              <p><strong>2. Use of Information:</strong> We use your information to process orders, provide customer support, and improve our services. We do not sell or share your personal data with third parties, except for logistics and payment processing purposes.</p>
              <p><strong>3. Security:</strong> We implement industry-standard measures to protect your data, including SSL encryption and secure payment gateways.</p>
              <p><strong>4. Your Rights:</strong> You can request access to or deletion of your personal data at any time by contacting us at: <a href="mailto:vrfashionjewellery0044@gmail.com" className="underline">vrfashionjewellery0044@gmail.com</a></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
