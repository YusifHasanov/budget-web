"use client"

import { useState } from "react"
import { CustomerDetails } from "@/components/CustomerDetails"
import { UpdateCustomerForm } from "@/components/UpdateCustomerForm"
import { DateRangePicker } from "@/components/DateRangePicker"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { addDays } from "date-fns"

export default function CustomerPage({ params }: { params: { id: string } }) {
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  const [isUpdateCustomerDialogOpen, setIsUpdateCustomerDialogOpen] = useState(false)

  const handleCustomerUpdated = () => {
    setIsUpdateCustomerDialogOpen(false)
    // You might want to refresh the customer details here
  }

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <DateRangePicker date={dateRange} setDate={setDateRange  as any }/>
        <Dialog open={isUpdateCustomerDialogOpen} onOpenChange={setIsUpdateCustomerDialogOpen}>
          <DialogTrigger asChild>
            <Button>Update Customer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Customer</DialogTitle>
            </DialogHeader>
            <UpdateCustomerForm customerId={params.id} onCustomerUpdated={handleCustomerUpdated} />
          </DialogContent>
        </Dialog>
      </div>
      <CustomerDetails customerId={params.id} dateRange={dateRange} />
    </main>
  )
}

