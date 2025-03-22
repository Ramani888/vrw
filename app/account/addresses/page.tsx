"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton" // Import skeleton component
import { MapPin, Plus, Edit, Trash, AlertCircle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { serverAddDeliveryAddressData, serverGetDeliveryAddressData, serverUpdateDeliveryAddressData } from "@/services/serverApi"
import { StateData } from "@/utils/global"
import { toast } from "@/components/ui/use-toast" // Import toast for notifications

// Types for better type safety
interface AddressType {
  _id: string;
  addressFirst: string;
  addressSecond?: string;
  area: string;
  landmark?: string;
  country: string;
  state: string;
  city: string;
  pinCode: string;
  isDefault?: boolean;
  userId?: string;
}

interface AddressFormProps {
  address?: AddressType;
  onSubmit: (address: Partial<AddressType>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

// Address form component extracted for better organization
function AddressForm({ address, onSubmit, onCancel, isLoading }: AddressFormProps) {
  const [formData, setFormData] = useState<Partial<AddressType>>({
    addressFirst: "",
    addressSecond: "",
    area: "",
    landmark: "",
    country: "",
    state: "",
    city: "",
    pinCode: ""
  })

  const countries = ["India"] // Can be expanded as needed

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Reset state when country changes
    if (name === "country") {
      setFormData((prev) => ({ 
        ...prev, 
        [name]: value,
        state: "" // Reset state when country changes
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onSubmit({
        ...formData,
        _id: address?._id
      })
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  useEffect(() => {
    // If address exists (editing mode), fill the form with address data
    if (address?._id) {
      setFormData({
        addressFirst: address.addressFirst || "",
        addressSecond: address.addressSecond || "",
        area: address.area || "",
        landmark: address.landmark || "",
        country: address.country || "",
        state: address.state || "",
        city: address.city || "",
        pinCode: address.pinCode || ""
      })
    } else {
      // If no address (adding mode), reset the form
      setFormData({
        addressFirst: "",
        addressSecond: "",
        area: "",
        landmark: "",
        country: "",
        state: "",
        city: "",
        pinCode: ""
      })
    }
  }, [address])

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{address ? "Edit Address" : "Add New Address"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="addressFirst">Address Line 1</Label>
          <Input id="addressFirst" name="addressFirst" value={formData.addressFirst} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="addressSecond">Address Line 2 (Optional)</Label>
          <Input id="addressSecond" name="addressSecond" value={formData.addressSecond} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="area">Area</Label>
          <Input id="area" name="area" value={formData.area} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="landmark">Landmark (Optional)</Label>
          <Input id="landmark" name="landmark" value={formData.landmark} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <select 
              id="country" 
              name="country" 
              value={formData.country} 
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Select Country</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <select 
              id="state" 
              name="state" 
              value={formData.state} 
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
              disabled={!formData.country}
            >
              <option value="">Select State</option>
              {formData.country && StateData?.map(state => (
                <option key={state?.name} value={state?.name}>{state?.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pinCode">PIN Code</Label>
            <Input 
              id="pinCode" 
              name="pinCode" 
              value={formData.pinCode} 
              onChange={handleChange}
              pattern="[0-9]{6}" 
              maxLength={6}
              required 
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : address ? "Update Address" : "Add Address"}
          </Button>
        </div>
      </form>
    </DialogContent>
  )
}

// Skeleton component for loading state
function AddressCardSkeleton() {
  return (
    <Card className="border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-32" />
      </CardFooter>
    </Card>
  )
}

// Empty state component
function EmptyAddressState() {
  return (
    <Card className="col-span-full p-6">
      <div className="flex flex-col items-center justify-center text-center space-y-3">
        <div className="bg-primary/10 p-3 rounded-full">
          <MapPin className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-medium text-lg">No addresses found</h3>
        <p className="text-sm text-muted-foreground">
          You haven't added any delivery addresses yet. Add your first address to get started.
        </p>
      </div>
    </Card>
  )
}

// Address card component
function AddressCard({ 
  address, 
  onEdit,
  isDefault
}: { 
  address: AddressType; 
  onEdit: (address: AddressType) => void;
  isDefault?: boolean;
}) {
  return (
    <Card key={address._id} className={isDefault ? "border-primary" : ""}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {"Home"}
          </CardTitle>
          {isDefault && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Default</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-1 text-sm">
          <p>{address.addressFirst}</p>
          {address.addressSecond && <p>{address.addressSecond}</p>}
          <p>
            {address.area}
            {address.landmark && `, ${address.landmark}`}
            {`, ${address.city}, ${address.state}, ${address.country}, ${address.pinCode}`}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="ghost" size="sm" onClick={() => onEdit(address)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <div className="flex gap-2">
          {/* Additional buttons can be added here */}
        </div>
      </CardFooter>
    </Card>
  )
}

export default function AddressesPage() {
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<AddressType | null>(null);
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getDeliveryAddressData = useCallback(async () => {
    if (!user?._id) return;
    
    try {
      setLoading(true);
      setError(null);
      const res = await serverGetDeliveryAddressData(String(user._id));
      setAddresses(res?.deliveryAddressData || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load addresses");
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  const handleAddAddress = async (address: Partial<AddressType>) => {
    try {
      setSubmitting(true);
      await serverAddDeliveryAddressData({...address, userId: user?._id});
      await getDeliveryAddressData();
      setIsAddDialogOpen(false);
      toast({
        title: "Address added",
        description: "Your new address has been added successfully",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to add address",
        description: "There was an error adding your address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const handleEditAddress = async (address: Partial<AddressType>) => {
    try {
      setSubmitting(true);
      await serverUpdateDeliveryAddressData({...address});
      await getDeliveryAddressData();
      setIsEditDialogOpen(false);
      setCurrentAddress(null);
      toast({
        title: "Address updated",
        description: "Your address has been updated successfully",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to update address",
        description: "There was an error updating your address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const openEditDialog = (address: AddressType) => {
    setCurrentAddress(address);
    setIsEditDialogOpen(true);
  }

  useEffect(() => {
    if (user?._id) {
      getDeliveryAddressData();
    }
  }, [user, getDeliveryAddressData]);

  return (
    <div className="w-full px-4 py-8 md:px-6 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Addresses</h1>
        <Link href="/account">
          <Button variant="outline">Back to Account</Button>
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 border border-destructive/50 rounded-md bg-destructive/10 text-destructive flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-auto" 
            onClick={() => getDeliveryAddressData()}
          >
            Retry
          </Button>
        </div>
      )}

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
          <AddressForm 
            onSubmit={handleAddAddress} 
            onCancel={() => setIsAddDialogOpen(false)} 
            isLoading={submitting}
          />
        </Dialog>

        {/* Loading State */}
        {loading && (
          <>
            <AddressCardSkeleton />
            <AddressCardSkeleton />
            <AddressCardSkeleton />
          </>
        )}

        {/* Empty State */}
        {!loading && addresses.length === 0 && <EmptyAddressState />}

        {/* Address Cards */}
        {!loading && addresses.map((address) => (
          <AddressCard 
            key={address._id} 
            address={address} 
            isDefault={true} // Set based on your default address logic
            onEdit={openEditDialog} 
          />
        ))}
      </div>
      
      {/* Edit Dialog */}
      <Dialog 
        open={isEditDialogOpen} 
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setCurrentAddress(null);
        }}
      >
        {currentAddress && (
          <AddressForm
            address={currentAddress}
            onSubmit={handleEditAddress}
            onCancel={() => setIsEditDialogOpen(false)}
            isLoading={submitting}
          />
        )}
      </Dialog>
    </div>
  )
}