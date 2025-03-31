"use client"

import { useEffect, useState } from "react"
import { CustomerList } from "@/components/CustomerList"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePicker } from "@/components/DateRangePicker"
import { AddCustomerForm } from "@/components/AddCustomerForm"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { addDays } from "date-fns"
import { PlusCircle, ArrowUpCircle, ArrowDownCircle, DollarSign } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentTransactions } from "@/components/RecentTransactions"

export default function Home() {
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const [isAddCustomerDialogOpen, setIsAddCustomerDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isTotalLoading, setIsTotalLoading] = useState(true)
  const [responseData, setResponseData] = useState([] as any)
  const [totalData, setTotalData] = useState({} as any)
  const [i, setI] = useState<number>(0)

  const handleCustomerAdded = () => {
    setIsAddCustomerDialogOpen(false)
    setI((prev) => prev + 1)
  }

  useEffect(() => {
    fetch(`/base-api/customer`)
        .then((res) => res.json())
        .then((data) => {
          setResponseData(data.data)
          setIsLoading(false)
        })
        .catch((err) => {
          console.log(err)
          setIsLoading(false)
        })
  }, [i])

  useEffect(() => {
    fetch(`/base-api/report/total-cashflow`)
        .then((res) => res.json())
        .then((data) => {
          setTotalData(data.data)
          setIsTotalLoading(false)
        })
        .catch((err) => {
          console.log(err)
          setIsTotalLoading(false)
        })
  }, [i])

  return (
      <main className="container mx-auto p-4 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">Dashboard</h1>

          <div className="flex sm:flex-row flex-col gap-2 w-full sm:w-auto">
            <DateRangePicker date={dateRange} setDate={setDateRange as any} />

            <Dialog open={isAddCustomerDialogOpen} onOpenChange={setIsAddCustomerDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Customer
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Customer</DialogTitle>
                </DialogHeader>
                <AddCustomerForm onCustomerAdded={handleCustomerAdded} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="shadow-md rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              {isTotalLoading ? (
                  <Skeleton className="h-8 w-24" />
              ) : (
                  <div className="flex items-center space-x-2">
                    <ArrowUpCircle className="h-5 w-5 text-green-500" />
                    <span className="text-2xl font-bold text-green-600">{totalData.totalPaid?.toFixed(2) || "0.00"}₼</span>
                  </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              {isTotalLoading ? (
                  <Skeleton className="h-8 w-24" />
              ) : (
                  <div className="flex items-center space-x-2">
                    <ArrowDownCircle className="h-5 w-5 text-red-500" />
                    <span className="text-2xl font-bold text-red-600">{totalData.totalDebt?.toFixed(2) || "0.00"}₼</span>
                  </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
            </CardHeader>
            <CardContent>
              {isTotalLoading ? (
                  <Skeleton className="h-8 w-24" />
              ) : (
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-blue-500" />
                    <span
                        className={`text-2xl font-bold ${(totalData.totalPaid - totalData.totalDebt) >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                  {(totalData.totalPaid - totalData.totalDebt)?.toFixed(2) || "0.00"}₼
                </span>
                  </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="customers" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="recent">Recent Transactions</TabsTrigger>
          </TabsList>
          <TabsContent value="customers">
            <CustomerList customers={responseData} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="recent">
            <RecentTransactions />
          </TabsContent>
        </Tabs>
      </main>
  )
}

