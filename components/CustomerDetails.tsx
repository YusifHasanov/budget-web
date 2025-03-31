"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AddTransactionForm } from "@/components/AddTransactionForm"
import { EditTransactionForm } from "@/components/EditTransactionForm"
import { ArrowDownIcon, ArrowUpIcon, Edit2Icon, Trash2Icon, PlusCircle } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export function CustomerDetails({ customerId, dateRange }: { customerId: number; dateRange: DateRange }) {
  const [details, setDetails] = useState(null as any)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [activeTab, setActiveTab] = useState("transactions")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCustomerDetails()
  }, [customerId, dateRange])

  const fetchCustomerDetails = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/base-api/report/cashflow?customerId=${customerId}`)
      const data = await res.json()
      setDetails(data.data)
    } catch (err) {
      console.error(err)
      toast({
        title: "Error",
        description: "Failed to load customer details",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTransactionAdded = () => {
    fetchCustomerDetails()
    setIsAddDialogOpen(false)
    toast({
      title: "Success",
      description: "Transaction added successfully",
    })
  }

  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction)
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (transaction) => {
    setSelectedTransaction(transaction)
    setIsDeleteDialogOpen(true)
  }

  const handleTransactionEdited = () => {
    fetchCustomerDetails()
    setIsEditDialogOpen(false)
    toast({
      title: "Success",
      description: "Transaction updated successfully",
    })
  }

  const handleTransactionDeleted = async () => {
    try {
      const response = await fetch(`/base-api/customer/reverse/${selectedTransaction.id}`, {
        method: "POST",
      })
      if (response.ok) {
        fetchCustomerDetails()
        setIsDeleteDialogOpen(false)
        toast({
          title: "Success",
          description: "Transaction deleted successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete transaction",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting transaction:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!details) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="text-xl font-semibold mb-2">Customer Not Found</h2>
        <p className="text-muted-foreground">The requested customer could not be found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
            <div>
              <CardTitle className="text-2xl">{details.name}</CardTitle>
              {details.address && <CardDescription className="mt-1">{details.address}</CardDescription>}
            </div>
            <Badge
              className={`w-fit ${details.currentDebt <= 0 ? "bg-green-500" : details.currentDebt > 1000 ? "bg-red-500" : "bg-blue-500"}`}
            >
              {details.currentDebt <= 0 ? "Paid" : details.currentDebt > 1000 ? "High Debt" : "Active"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">
              <p className="font-semibold text-sm sm:text-lg text-green-800 dark:text-green-300">Total Income</p>
              <p className="text-md sm:text-2xl font-bold text-green-600 dark:text-green-400">
                {details.totalPaid.toFixed(2)}₼
              </p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">
              <p className="font-semibold text-sm sm:text-lg text-red-800 dark:text-red-300">Current Debt</p>
              <p className="text-md sm:text-2xl font-bold text-red-600 dark:text-red-400">
                {details.currentDebt.toFixed(2)}₼
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg">
              <p className="font-semibold text-sm sm:text-lg text-blue-800 dark:text-blue-300">Total Debt</p>
              <p className="text-md sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                {details.totalDebt.toFixed(2)}₼
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Transactions</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Transaction
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Transaction</DialogTitle>
                  </DialogHeader>
                  <AddTransactionForm customerId={customerId} onTransactionAdded={handleTransactionAdded} />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {details.transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    details.transactions.map((transaction: any, index: any) => (
                      <TableRow key={index}>
                        <TableCell>
                          {new Date(transaction.paymentDate).toLocaleString("en-GB", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell>
                          {transaction.eventType === 0 ? (
                            <Badge
                              variant="outline"
                              className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800"
                            >
                              Debt
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800"
                            >
                              Payment
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell
                          className={
                            transaction.eventType === 0
                              ? "text-red-600 dark:text-red-400"
                              : "text-green-600 dark:text-green-400"
                          }
                        >
                          <span className="flex items-center">
                            {transaction.eventType === 1 ? (
                              <ArrowDownIcon className="mr-1" size={16} />
                            ) : (
                              <ArrowUpIcon className="mr-1" size={16} />
                            )}
                            {transaction.amount.toFixed(2)}₼
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(transaction)}>
                              <Edit2Icon className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(transaction)}>
                              <Trash2Icon className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {details.transactions.length === 0 ? (
                  <p className="text-center py-6 text-muted-foreground">No payment history available</p>
                ) : (
                  <div className="space-y-4">
                    {details.transactions
                      .filter((t) => t.eventType === 1)
                      .map((transaction, index) => (
                        <div key={index} className="flex items-center p-3 border rounded-lg">
                          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-4">
                            <ArrowDownIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Payment Received</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(transaction.paymentDate).toLocaleString("en-GB", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <p className="font-bold text-green-600 dark:text-green-400">
                            {transaction.amount.toFixed(2)}₼
                          </p>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Transaction Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <EditTransactionForm
              transaction={selectedTransaction}
              onTransactionEdited={handleTransactionEdited}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Transaction Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the transaction from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleTransactionDeleted}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

