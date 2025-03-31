"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, Calendar, User } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

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

export function RecentTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchTransactions = async () => {
            setIsLoading(true)
            try {
                const response = await fetch("/base-api/customer/recent-transactions")
                const data = await response.json()

                if (data.isSuccess && data.data) {
                    setTransactions(data.data)
                } else {
                    console.error("Failed to fetch recent transactions:", data.message)
                }
            } catch (error) {
                console.error("Error fetching recent transactions:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchTransactions()
    }, [])

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString)
            return format(date, "MMM dd, yyyy HH:mm")
        } catch (error) {
            return "Invalid date"
        }
    }

    const navigateToCustomer = (customerId: number) => {
        router.push(`/customer/${customerId}`)
    }

    if (isLoading) {
        return (
            <Card className="shadow-md rounded-xl">
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center p-3 border rounded-lg">
                                <Skeleton className="h-10 w-10 rounded-full mr-4" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <Skeleton className="h-6 w-20" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="shadow-md rounded-xl">
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
                {transactions.length === 0 ? (
                    <p className="text-center py-6 text-muted-foreground">No recent transactions found</p>
                ) : (
                    <div className="space-y-4">
                        {transactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="flex items-center p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                            >
                                <div
                                    className={`p-2 rounded-full mr-4 ${
                                        transaction.eventType === 1 ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
                                    }`}
                                >
                                    {transaction.eventType === 1 ? (
                                        <ArrowDownIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    ) : (
                                        <ArrowUpIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center">
                                        <p className="font-medium">{transaction.eventType === 1 ? "Payment Received" : "Debt Added"}</p>
                                        <Badge
                                            variant="outline"
                                            className="ml-2 cursor-pointer hover:bg-primary/10"
                                            onClick={() => navigateToCustomer(transaction.customer.id)}
                                        >
                                            <User className="h-3 w-3 mr-1" />
                                            {transaction.customer.name}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {formatDate(transaction.createdAt)}
                                    </div>
                                </div>

                                <p
                                    className={`font-bold ${
                                        transaction.eventType === 1
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-red-600 dark:text-red-400"
                                    }`}
                                >
                                    {transaction.eventType === 1 ? "+" : "-"}
                                    {transaction.amount.toFixed(2)}₼
                                </p>
                            </div>
                        ))}

                        <Button variant="outline" className="w-full mt-4" onClick={() => router.push("/transactions")}>
                            View All Transactions
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

