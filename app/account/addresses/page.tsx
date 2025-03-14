"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MapPin, Plus, Edit, Trash } from "lucide-react"

// Mock addresses data
const initialAddresses = [
  {
    id: "1",
    name: "John Doe",
    phone: "+1 (123) 456-7890",
    addressLine1: "123 Main Street",
    addressLine2: "Apt 4B",
    city: "New York",
    state: "NY",
    pincode: "10001",
    type: "home",
    isDefault: true,
  },
  {
    id: "2",
    name: "John Doe",
    phone: "+1 (123) 456-7890",
    addressLine1: "456 Office Plaza",
    addressLine2: "Suite 200",
    city: "New York",
    state: "NY",
    pincode: "10002",
    type: "work",
    isDefault: false,
  },
]

export default function AddressesPage() {
  const [addresses, setAddresses] = useState(initialAddresses)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentAddress, setCurrentAddress] = useState<any>(null)

  const handleAddAddress = (address: any) => {
    const newAddress = {
      ...address,
      id: Date.now().toString(),
    }
    setAddresses([...addresses, newAddress])
    setIsAddDialogOpen(false)
  }

  const handleEditAddress = (address: any) => {
    setAddresses(addresses.map((a) => (a.id === address.id ? address : a)))
    setIsEditDialogOpen(false)
  }

  const handleDeleteAddress = (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      setAddresses(addresses.filter((a) => a.id !== id))
    }
  }

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      })),
    )
  }

  return (
    <div className="w-full px-4 py-8 md:px-6 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Addresses</h1>
        <Link href="/account">
          <Button variant="outline">Back to Account</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Add New Address Card */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Card className="border-dashed cursor-pointer hover:border-primary/50 transition-colors">
              <CardContent className="flex flex-col items-center justify-center h-full py-12">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Add New Address</h3>
                <p className="text-sm text-muted-foreground mt-1">Add a new delivery address</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <AddressForm onSubmit={handleAddAddress} onCancel={() => setIsAddDialogOpen(false)} />
        </Dialog>

        {/* Address Cards */}
        {addresses.map((address) => (
          <Card key={address.id} className={address.isDefault ? "border-primary" : ""}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {address.type === "home" ? "Home" : "Work"}
                </CardTitle>
                {address.isDefault && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Default</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="space-y-1 text-sm">
                <p className="font-medium">{address.name}</p>
                <p>{address.addressLine1}</p>
                {address.addressLine2 && <p>{address.addressLine2}</p>}
                <p>
                  {address.city}, {address.state} {address.pincode}
                </p>
                <p className="pt-1">{address.phone}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Dialog
                open={isEditDialogOpen && currentAddress?.id === address.id}
                onOpenChange={(open) => {
                  setIsEditDialogOpen(open)
                  if (!open) setCurrentAddress(null)
                }}
              >
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => setCurrentAddress(address)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </DialogTrigger>
                {currentAddress?.id === address.id && (
                  <AddressForm
                    address={address}
                    onSubmit={handleEditAddress}
                    onCancel={() => setIsEditDialogOpen(false)}
                  />
                )}
              </Dialog>
              <div className="flex gap-2">
                {!address.isDefault && (
                  <Button variant="outline" size="sm" onClick={() => handleSetDefault(address.id)}>
                    Set as Default
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

function AddressForm({
  address,
  onSubmit,
  onCancel,
}: { address?: any; onSubmit: (address: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: address?.name || "",
    phone: address?.phone || "",
    addressLine1: address?.addressLine1 || "",
    addressLine2: address?.addressLine2 || "",
    city: address?.city || "",
    state: address?.state || "",
    pincode: address?.pincode || "",
    type: address?.type || "home",
    isDefault: address?.isDefault || false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      id: address?.id,
    })
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{address ? "Edit Address" : "Add New Address"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="addressLine1">Address Line 1</Label>
          <Input id="addressLine1" name="addressLine1" value={formData.addressLine1} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
          <Input id="addressLine2" name="addressLine2" value={formData.addressLine2} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input id="state" name="state" value={formData.state} onChange={handleChange} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="pincode">PIN Code</Label>
          <Input id="pincode" name="pincode" value={formData.pincode} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label>Address Type</Label>
          <RadioGroup
            value={formData.type}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="home" id="home" />
              <Label htmlFor="home">Home</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="work" id="work" />
              <Label htmlFor="work">Work</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isDefault"
            checked={formData.isDefault}
            onChange={(e) => setFormData((prev) => ({ ...prev, isDefault: e.target.checked }))}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="isDefault" className="text-sm font-normal">
            Set as default address
          </Label>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{address ? "Update Address" : "Add Address"}</Button>
        </div>
      </form>
    </DialogContent>
  )
}

