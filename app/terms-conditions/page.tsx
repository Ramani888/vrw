// "use client"

// import { Card, CardContent } from "@/components/ui/card"

// export default function TermsAndConditionsPage() {
//   return (
//     <div className="w-full px-4 py-8 md:px-6 md:py-12">
//       <div className="mx-auto max-w-4xl text-center">
//         <h1 className="text-3xl font-bold md:text-4xl">Terms and Conditions</h1>
//         <p className="mt-4 text-muted-foreground">Please read our terms and conditions carefully.</p>
//       </div>

//       <div className="mt-8 max-w-4xl mx-auto">
//         <Card>
//           <CardContent className="p-6 space-y-4 text-sm text-muted-foreground">
//             <p>
//               By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement.
//               If you do not agree to abide by the above, please do not use this service.
//             </p>
//             <p>
//               All products and services provided are subject to availability. We reserve the right to change or discontinue any product at any time without notice.
//             </p>
//             <p>
//               You agree not to misuse our website for fraudulent purposes, or to conduct any unlawful activity that could harm the company or other users.
//             </p>
//             <p>
//               All content on this website, including logos, images, and text, is owned by us and protected by copyright laws.
//             </p>
//             <p>
//               These terms may be modified at any time. It is your responsibility to review them regularly.
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }


"use client"

import { Card, CardContent } from "@/components/ui/card"

export default function PoliciesPage() {
  return (
    <div className="w-full px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-3xl font-bold md:text-4xl">Terms &amp; Conditions</h1>
        <p className="mt-4 text-muted-foreground">
          Please read the terms and conditions carefully before using our website.
        </p>
      </div>

      <div className="mt-12">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground space-y-4">
              <p><strong>Welcome to VR Fashions Jewellery.</strong> By accessing or using our website, you agree to comply with and be bound by the following terms and conditions. Please read them carefully before using our services.</p>
              <p><strong>1. Use of Website:</strong> You must be at least 18 years old or under the supervision of a parent/guardian to use this site. All information provided must be accurate and current.</p>
              <p><strong>2. Intellectual Property:</strong> All content on this site, including logos, images, and text, is the property of VR Fashions Jewellery and is protected by copyright laws. Unauthorized use is prohibited.</p>
              <p><strong>3. Product Information:</strong> We strive to ensure all product descriptions and prices are accurate. However, errors may occur. In such cases, we reserve the right to correct the information and cancel orders if necessary.</p>
              <p><strong>4. Pricing & Payment:</strong> All prices are listed in INR. We accept payments via Cash on Delivery, UPI, Net Banking, and Credit/Debit Cards.</p>
              <p><strong>5. Order Cancellation:</strong> Orders may be canceled by the customer within 24 hours or before dispatch, whichever comes first.</p>
              <p><strong>6. Limitation of Liability:</strong> We are not liable for any indirect, incidental, or consequential damages arising from the use of our products or services.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
