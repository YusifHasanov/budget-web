import type { Metadata } from "next"
import { AllTransactions } from "@/components/AllTransactions"

export const metadata: Metadata = {
    title: "All Transactions | Customer Management",
    description: "View all transactions across all customers",
}

export default function TransactionsPage() {
    return (
        <main className="container mx-auto p-4 space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold">All Transactions</h1>
            </div>

            <AllTransactions />
        </main>
    )
}

