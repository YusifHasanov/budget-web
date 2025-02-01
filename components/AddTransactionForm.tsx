"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"

interface AddTransactionFormProps {
  customerId: string
  onTransactionAdded: () => void
}

export function AddTransactionForm({ customerId, onTransactionAdded }: AddTransactionFormProps) {
  const [amount, setAmount] = useState("")
  const [eventType, setEventType] = useState("0")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch(`/api/customers/${customerId}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number.parseFloat(amount), eventType: Number.parseInt(eventType) }),
    })
    const data = await response.json()
    if (data.isSuccess) {
      toast({ title: "Transaction added successfully" })
      setAmount("")
      onTransactionAdded()
    } else {
      toast({ title: "Error adding transaction", variant: "destructive" })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="amount">Məbləğ</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="0.01"
          step="0.01"
        />
      </div>
      <RadioGroup value={eventType} onValueChange={setEventType}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="0" id="debt" />
          <Label htmlFor="debt">Borc</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="1" id="payment" />
          <Label htmlFor="payment">Ödəniş</Label>
        </div>
      </RadioGroup>
      <Button type="submit">Əlavə et</Button>
    </form>
  )
}

