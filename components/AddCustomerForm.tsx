"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface AddCustomerFormProps {
  onCustomerAdded: () => void
}

export function AddCustomerForm({ onCustomerAdded }: AddCustomerFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [address, setAddress] = useState("")
  const [totalDebt, setTotalDebt] = useState("0")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch(`/base-api/customer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        address,
        totalDebt: Number.parseFloat(totalDebt),
      }),
    })
    const data = await response.json()
    if (data.isSuccess) {
      toast({ title: "Customer added successfully" })
      setName("")
      setDescription("")
      setAddress("")
      setTotalDebt("0")
      onCustomerAdded()
    } else {
      toast({ title: "Error adding customer", variant: "destructive" })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Ad</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="description">Açıqlama</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="address">Adresi</Label>
        <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="totalDebt">İlkin Borcu</Label>
        <Input
          id="totalDebt"
          type="number"
          value={totalDebt}
          onChange={(e) => setTotalDebt(e.target.value)}
          step="0.01"
          min="0"
        />
      </div>
      <Button type="submit">Əlavə et</Button>
    </form>
  )
}

