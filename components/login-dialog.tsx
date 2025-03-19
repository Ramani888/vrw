"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { StateData } from "@/utils/global"
import { serverRegisterLogin } from "@/services/serverApi"
import Cookies from "js-cookie";

const loginSchema = z.object({
  mobileNumber: z
    .string()
    .min(10, { message: "Mobile number must be at least 10 digits" })
    .max(10, { message: "Mobile number must not exceed 10 digits" })
    .regex(/^\d+$/, { message: "Mobile number must contain only digits" }),
  state: z.string().min(1, { message: "Please select a state" }),
  city: z.string().min(1, { message: "Please enter a city" }),
  pinCode: z
    .string()
    .min(4, { message: "Pincode must be at least 4 digits" })
    .max(10, { message: "Pincode must not exceed 10 digits" })
    .regex(/^\d+$/, { message: "Pincode must contain only digits" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface LoginDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  redirectUrl?: string
}

export default function LoginDialog({ isOpen, onClose, onSuccess, redirectUrl }: LoginDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      mobileNumber: "",
      state: "",
      city: "",
      pinCode: "",
    },
  })

  // Reset form fields when dialog opens
  useEffect(() => {
    if (isOpen) {
      form.reset()
      setError(null) // Clear any previous error messages
    }
  }, [isOpen, form])

  const handleSubmit = async (data: LoginFormValues) => {
    setLoading(true)
    setError(null)

    try {
      const res = await serverRegisterLogin({ ...data, country: "India", fcm_token: 'testing' });
      if (res?.userDataAndToken) {
        Cookies.set("auth-token", res?.userDataAndToken?.token, { expires: 7 });
        localStorage.setItem('user', JSON.stringify(res?.userDataAndToken));
      }
      onSuccess()
      router.push(redirectUrl ?? '/')
    } catch (err) {
      console.error("Login error:", err)
      setError("Authentication failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign in to continue</DialogTitle>
        </DialogHeader>

        {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {StateData?.map((state) => (
                        <SelectItem key={state.name} value={state.name}>
                          {state.name}
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
              name="pinCode"
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

            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <div className="text-sm text-muted-foreground w-full">
                <Link href="/signup" className="text-primary hover:underline" onClick={(e) => onClose()}>
                  Create an account
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}