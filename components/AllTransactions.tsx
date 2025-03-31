"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Search, ArrowUpDown } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Transaction {
    id: number
    amount: number
    eventType: number
    totalDebt: number
    createdAt: string
    customer: {
        id: number
        name: string
        description: string | null
        address: string | null
        currentDebt: number
    }
}

export function AllTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [transactionType, setTransactionType] = useState("all")
    const [sortField, setSortField] = useState<"createdAt" | "amount">("createdAt")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
    const router = useRouter()

    useEffect(() => {
        const fetchTransactions = async () => {
            setIsLoading(true)
            try {
                const response = await fetch("/base-api/customer/recent-transactions")
                const data = await response.json()

                if (data.isSuccess && data.data) {
                    setTransactions(data.data)
                    setFilteredTransactions(data.data)
                } else {
                    console.error("Failed to fetch transactions:", data.message)
                }
            } catch (error) {
                console.error("Error fetching transactions:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchTransactions()
    }, [])

    useEffect(() => {
        // Filter transactions based on search term and transaction type
        let filtered = [...transactions]

        if (searchTerm) {
            filtered = filtered.filter((transaction) =>
                transaction.customer.name.toLowerCase().includes(searchTerm.toLowerCase()),
            )
        }

        if (transactionType !== "all") {
            const eventTypeValue = transactionType === "payment" ? 1 : 0
            filtered = filtered.filter((transaction) => transaction.eventType === eventTypeValue)
        }

        // Sort transactions
        filtered.sort((a, b) => {
            if (sortField === "createdAt") {
                const dateA = new Date(a.createdAt).getTime()
                const dateB = new Date(b.createdAt).getTime()
                return sortDirection === "asc" ? dateA - dateB : dateB - dateA
            } else {
                return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount
            }
        })

        setFilteredTransactions(filtered)
    }, [transactions, searchTerm, transactionType, sortField, sortDirection])

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString)
            return format(date, "MMM dd, yyyy HH:mm")
        } catch (error) {
            return "Invalid date"
        }
    }

    const handleSort = (field: "createdAt" | "amount") => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("desc")
        }
    }

    if (isLoading) {
        return (
            <Card className="shadow-md rounded-xl">
                <CardHeader>
                    <CardTitle>Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="shadow-md rounded-xl">
            <CardHeader>
                <CardTitle>All Transactions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by customer name..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Select value={transactionType} onValueChange={setTransactionType}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Transaction type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Transactions</SelectItem>
                            <SelectItem value="payment">Payments</SelectItem>
                            <SelectItem value="debt">Debts</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {filteredTransactions.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">No transactions found</div>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="cursor-pointer" onClick={() => handleSort("createdAt")}>
                                        <div className="flex items-center">
                                            Date
                                            {sortField === "createdAt" && (
                                                <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-right cursor-pointer" onClick={() => handleSort("amount")}>
                                        <div className="flex items-center justify-end">
                                            Amount
                                            {sortField === "amount" && (
                                                <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                                            )}
                                        </div>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTransactions.map((transaction) => (
                                    <TableRow
                                        key={transaction.id}
                                        className="cursor-pointer hover:bg-accent/50"
                                        onClick={() => router.push(`/customer/${transaction.customer.id}`)}
                                    >
                                        <TableCell>
                                            <div className="font-medium">{transaction.customer.name}</div>
                                        </TableCell>
                                        <TableCell>
                                            {transaction.eventType === 1 ? (
                                                <Badge className="bg-green-500">Payment</Badge>
                                            ) : (
                                                <Badge className="bg-red-500">Debt</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                                {formatDate(transaction.createdAt)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                      <span
                          className={
                              transaction.eventType === 1
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                          }
                      >
                        {transaction.eventType === 1 ? "+" : "-"}
                          {transaction.amount.toFixed(2)}₼
                      </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

