"use client"

import { Card, CardContent } from "@/components/ui/card"

export default function PoliciesPage() {
  return (
    <div className="w-full px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-3xl font-bold md:text-4xl">Return / Refund / Cancellation Policy</h1>
        <p className="mt-4 text-muted-foreground">
          We want you to be completely satisfied with your purchase. Please review our return, refund, and cancellation policies below.
        </p>
      </div>

      <div className="mt-12">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground space-y-4">
              <p><strong>1. Returns:</strong> Returns are accepted within 7 days of delivery. The product must be unused, in original packaging, and with tags intact.</p>
              <p><strong>2. Refunds:</strong> Refunds will be initiated within 5–7 business days after the returned product is received and inspected. Refunds are processed to the original payment method.</p>
              <p><strong>3. Cancellation:</strong> Orders can be canceled within 24 hours or before dispatch. Once shipped, cancellations are not possible.</p>
              <p><strong>4. Non-Returnable Items:</strong> Personalized or custom-made jewellery is not eligible for return/refund unless damaged during shipping.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
