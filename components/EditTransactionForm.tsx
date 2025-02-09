"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function EditTransactionForm({ transaction, onTransactionEdited, onCancel }) {
    const [amount, setAmount] = useState(transaction.amount)
    const [eventType, setEventType] = useState(transaction.eventType.toString())
    const [paymentDate, setPaymentDate] = useState(new Date(transaction.paymentDate).toISOString().split("T")[0])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`/base-api/customer/update-debt/${transaction.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, eventType: Number.parseInt(eventType), debtDate: paymentDate }),
            })
            if (response.ok) {
                onTransactionEdited()
            } else {
                console.error("Failed to update transaction")
            }
        } catch (error) {
            console.error("Error updating transaction:", error)
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
                    <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="0">Debt</SelectItem>
                    <SelectItem value="1">Payment</SelectItem>
                </SelectContent>
            </Select>
            <Input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
            </div>
        </form>
    )
}

