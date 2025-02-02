"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AddTransactionForm } from "@/components/AddTransactionForm"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"


export function CustomerDetails({ customerId, dateRange }: { customerId: string; dateRange: DateRange }) {
  const [details, setDetails] = useState(null as any)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchCustomerDetails()
  }, [customerId])

  const fetchCustomerDetails = async () => {
    fetch(`/base-api/report/cashflow?customerId=${customerId}`)
        .then(res => res.json())
        .then(data => {
          setDetails(data.data)
        })
        .catch(err => console.log(err))
  }

  const handleTransactionAdded = () => {
    fetchCustomerDetails()
    setIsDialogOpen(false)
  }

  if (!details) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-green-100 p-4 rounded-lg">
              <p className="font-semibold text-green-800">Ümumi Gəlir</p>
              <p className="text-2xl font-bold text-green-600">{details.totalPaid.toFixed(2)}₼</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <p className="font-semibold text-red-800">Ümumi Xərc</p>
              <p className="text-2xl font-bold text-red-600">{details.totalDebt.toFixed(2)}₼</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transaksiyalar</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Yenisini əlavə et</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Proses əlavə et</DialogTitle>
              </DialogHeader>
              <AddTransactionForm customerId={customerId} onTransactionAdded={handleTransactionAdded} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarix</TableHead>
                <TableHead>Borc</TableHead>
                <TableHead>Ödəniş</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {details.transactions.map((transaction : any, index : any) => (
                <TableRow key={index}>
                  <TableCell> {new Date(transaction.paymentDate).toLocaleString("en-GB", {
                    hour12: false,
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}</TableCell>
                  <TableCell className={transaction.eventType === 0 ? "text-red-600" : ""}>
                    {transaction.eventType === 0 ? (
                      <span className="flex items-center">
                        <ArrowDownIcon className="mr-1" size={16} />{transaction.amount.toFixed(2)}₼
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCell className={transaction.eventType === 1 ? "text-green-600" : ""}>
                    {transaction.eventType === 1 ? (
                      <span className="flex items-center">
                        <ArrowUpIcon className="mr-1" size={16} />{transaction.amount.toFixed(2)}₼
                      </span>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

