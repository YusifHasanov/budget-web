"use client"

import { useState } from "react"
import { CustomerDetails } from "@/components/CustomerDetails"
import { UpdateCustomerForm } from "@/components/UpdateCustomerForm"
import { DateRangePicker } from "@/components/DateRangePicker"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { addDays } from "date-fns"
import {useRouter} from "next/navigation";

export default function CustomerPage({ params }: { params: { id: string } }) {
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  const [isUpdateCustomerDialogOpen, setIsUpdateCustomerDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleCustomerUpdated = () => {
    setIsUpdateCustomerDialogOpen(false)
    // You might want to refresh the customer details here
  }

  const handleDeleteCustomer = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/base-api/customer/${params.id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete customer")
      setIsDeleteDialogOpen(false)
      // Eğer müşteri silindiyse, yönlendirme veya listeyi yenileme yapılabilir
      router.push('/')// Silme sonrası yönlendirme
    } catch (error) {
      console.error("Error deleting customer:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
      <main className="container mx-auto p-4">
        <div className="flex justify-between flex-col sm:flex-row items-center mb-6">
          <DateRangePicker date={dateRange} setDate={setDateRange as any} />

          <div className="flex space-x-4">
            {/* Update Customer Dialog */}
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

            {/* Delete Customer Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">Delete Customer</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure you want to delete this customer?</DialogTitle>
                </DialogHeader>
                <DialogFooter className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                      variant="destructive"
                      onClick={handleDeleteCustomer}
                      disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Yes, Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <CustomerDetails customerId={params.id} dateRange={dateRange} />
      </main>
  )
}