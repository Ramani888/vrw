"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader } from "@/components/ui/loader"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff } from "lucide-react"

// Form validation schema
const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  mobile: z
    .string()
    .min(10, { message: "Mobile number must be at least 10 digits" })
    .max(15, { message: "Mobile number must not exceed 15 digits" })
    .regex(/^\d+$/, { message: "Mobile number must contain only digits" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  country: z.string().min(1, { message: "Please select a country" }),
  state: z.string().min(1, { message: "Please select a state" }),
  city: z.string().min(1, { message: "Please enter a city" }),
  pincode: z
    .string()
    .min(4, { message: "Pincode must be at least 4 digits" })
    .max(10, { message: "Pincode must not exceed 10 digits" })
    .regex(/^\d+$/, { message: "Pincode must contain only digits" }),
})

type SignupFormValues = z.infer<typeof signupSchema>

// Mock country data
const countries = [
  { id: "in", name: "India" },
  { id: "us", name: "United States" },
  { id: "uk", name: "United Kingdom" },
  { id: "ca", name: "Canada" },
  { id: "au", name: "Australia" },
]

// Mock state data by country
const statesByCountry: Record<string, { id: string; name: string }[]> = {
  in: [
    { id: "mh", name: "Maharashtra" },
    { id: "dl", name: "Delhi" },
    { id: "ka", name: "Karnataka" },
    { id: "tn", name: "Tamil Nadu" },
    { id: "gj", name: "Gujarat" },
  ],
  us: [
    { id: "ny", name: "New York" },
    { id: "ca", name: "California" },
    { id: "tx", name: "Texas" },
    { id: "fl", name: "Florida" },
    { id: "il", name: "Illinois" },
  ],
  uk: [
    { id: "en", name: "England" },
    { id: "sc", name: "Scotland" },
    { id: "wa", name: "Wales" },
    { id: "ni", name: "Northern Ireland" },
  ],
  ca: [
    { id: "on", name: "Ontario" },
    { id: "qc", name: "Quebec" },
    { id: "bc", name: "British Columbia" },
    { id: "ab", name: "Alberta" },
  ],
  au: [
    { id: "nsw", name: "New South Wales" },
    { id: "qld", name: "Queensland" },
    { id: "vic", name: "Victoria" },
    { id: "wa", name: "Western Australia" },
  ],
}

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [availableStates, setAvailableStates] = useState<{ id: string; name: string }[]>([])

  // Initialize form
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      mobile: "",
      password: "",
      email: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
    },
  })

  // Handle country change to update states
  const handleCountryChange = (countryId: string) => {
    form.setValue("state", "")
    setAvailableStates(statesByCountry[countryId] || [])
  }

  // Handle form submission
  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, you would send the data to your API
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // })
      // const result = await response.json()
      // if (!response.ok) throw new Error(result.message || 'Signup failed')

      console.log("Signup successful", data)

      // Redirect to login page after successful signup
      router.push("/login")
    } catch (err) {
      console.error("Signup error:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-8 md:py-12">
      <div className="mx-auto w-full max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground">Enter your details to create a new account</p>
        </div>

        {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="9876543210" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="••••••••" type={showPassword ? "text" : "password"} {...field} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        handleCountryChange(value)
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.id} value={country.id}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={availableStates.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableStates.map((state) => (
                          <SelectItem key={state.id} value={state.id}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Mumbai" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input placeholder="400001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader size="sm" className="mr-2" /> : null}
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

