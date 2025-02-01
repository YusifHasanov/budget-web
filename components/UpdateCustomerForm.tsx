"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface UpdateCustomerFormProps {
  customerId: string
  onCustomerUpdated: () => void
}

export function UpdateCustomerForm({ customerId, onCustomerUpdated }: UpdateCustomerFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [address, setAddress] = useState("")

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      const response = await fetch(`/api/customers/${customerId}`)
      const data = await response.json()
      if (data.isSuccess) {
        setName(data.data.name)
        setDescription(data.data.description)
        setAddress(data.data.address)
      }
    }
    fetchCustomerDetails()
  }, [customerId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch(`/api/customers/${customerId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, address }),
    })
    const data = await response.json()
    if (data.isSuccess) {
      toast({ title: "Customer updated successfully" })
      onCustomerUpdated()
    } else {
      toast({ title: "Error updating customer", variant: "destructive" })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      <Button type="submit">Update Customer</Button>
    </form>
  )
}

