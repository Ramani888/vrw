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
import { Eye, EyeOff } from "lucide-react"
import { serverLogin } from "@/services/serverApi"
import Cookies from "js-cookie";

// Form validation schema
const loginSchema = z.object({
  mobileNumber: z
    .string()
    .min(10, { message: "Mobile number must be at least 10 digits" })
    .max(15, { message: "Mobile number must not exceed 10 digits" })
    .regex(/^\d+$/, { message: "Mobile number must contain only digits" }),
  password: z.string().min(1, { message: "Password is required" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      mobileNumber: "",
      password: "",
    },
  })

  // Handle form submission
  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true)
    setError(null)

    try {
      const res = await serverLogin({...data, mobileNumber: Number(data?.mobileNumber)});
      if (res?.userDataAndToken) {
        Cookies.set("auth-token", res?.userDataAndToken?.token, { expires: 7 });
        localStorage.setItem('user', JSON.stringify(res?.userDataAndToken));
        router.push("/")
      }
      console.log('res', res);
      // Simulate API call with timeout
      // await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, you would send the data to your API
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // })
      // const result = await response.json()
      // if (!response.ok) throw new Error(result.message || 'Login failed')

      // console.log("Login successful", data)

      // Redirect to home page after successful login
      // router.push("/")
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err ? err?.response?.data?.error : "Invalid mobile number or password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-8 md:py-12">
      <div className="mx-auto w-full max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="mobileNumber"
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

            <div className="flex items-center justify-end">
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader size="sm" className="mr-2" /> : null}
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}