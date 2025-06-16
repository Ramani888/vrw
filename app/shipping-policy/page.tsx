"use client"

import { Card, CardContent } from "@/components/ui/card"

export default function PoliciesPage() {
  return (
    <div className="w-full px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-3xl font-bold md:text-4xl">Shipping Policy</h1>
        <p className="mt-4 text-muted-foreground">
          We strive to deliver your jewellery safely and on time. Please review our shipping policies below.
        </p>
      </div>

      <div className="mt-12">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground space-y-4">
              <p><strong>1. Shipping Locations:</strong> We currently ship across India.</p>
              <p><strong>2. Delivery Time:</strong> Orders are typically processed within 1–3 business days. Estimated delivery: 5–7 working days based on location.</p>
              <p><strong>3. Shipping Charges:</strong> Standard shipping is free on orders above ₹500. A nominal charge may apply for smaller orders.</p>
              <p><strong>4. Order Tracking:</strong> Once shipped, you will receive a tracking link via SMS or email.</p>
              <p><strong>5. Damaged Deliveries:</strong> If your package arrives damaged, please contact us with images within 24 hours of receipt.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
