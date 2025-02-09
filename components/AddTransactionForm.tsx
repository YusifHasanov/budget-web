"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AddTransactionForm({ customerId, onTransactionAdded }) {
  const [amount, setAmount] = useState(0)
  const [eventType, setEventType] = useState("0")
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`/base-api/customer/${customerId}/${eventType == "0" ? "add-debt" : "pay-debt"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          amount,
          eventType: Number.parseInt(eventType),
          paymentDate,
        }),
      })
      if (response.ok) {
        onTransactionAdded()
      } else {
        console.error("Failed to add transaction")
      }
    } catch (error) {
      console.error("Error adding transaction:", error)
    }
  }

  return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number.parseFloat(e.target.value))}
            placeholder="Amount"
        />
        <Select value={eventType} onValueChange={setEventType}>
          <SelectTrigger>
            <SelectValue placeholder="Sec event type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Borc elave et</SelectItem>
            <SelectItem value="1">Odenis elave et</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
        <Button type="submit">Elave et</Button>
      </form>
  )
}



// "use client"
//
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { toast } from "@/components/ui/use-toast"
//
// interface AddTransactionFormProps {
//   customerId: string
//   onTransactionAdded: () => void
// }
//
// export function AddTransactionForm({ customerId, onTransactionAdded }: AddTransactionFormProps) {
//   const [amount, setAmount] = useState("")
//   const [eventType, setEventType] = useState("0")
//
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const response = await fetch(`/base-api/customer/${customerId}/${eventType == "0" ? "add-debt": "pay-debt"}`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ amount: Number.parseFloat(amount), eventType: Number.parseInt(eventType) }),
//     })
//     const data = await response.json()
//     if (data.isSuccess) {
//       toast({ title: "Transaction added successfully" })
//       setAmount("")
//       onTransactionAdded()
//     } else {
//       toast({ title: "Error adding transaction", variant: "destructive" })
//     }
//   }
//
//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <Label htmlFor="amount">Məbləğ</Label>
//         <Input
//           id="amount"
//           type="number"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           required
//           min="0.01"
//           step="0.01"
//         />
//       </div>
//       <RadioGroup value={eventType} onValueChange={setEventType}>
//         <div className="flex items-center space-x-2">
//           <RadioGroupItem value="0" id="debt" />
//           <Label htmlFor="debt">Borc</Label>
//         </div>
//         <div className="flex items-center space-x-2">
//           <RadioGroupItem value="1" id="payment" />
//           <Label htmlFor="payment">Ödəniş</Label>
//         </div>
//       </RadioGroup>
//       <Button type="submit">Əlavə et</Button>
//     </form>
//   )
// }
//
