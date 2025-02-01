"use client"

import {useState} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Skeleton} from "@/components/ui/skeleton"
import Link from "next/link"
import {Search, ArrowUpDown, MoreHorizontal} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {useRouter} from "next/router";

interface Customer {
    id: number
    name: string
    description: string
    address: string | null
    totalDebt: number,
    customerId: number,
    transactionId: number
}

export function CustomerList({customers, isLoading}: { customers: Customer[], isLoading: boolean }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [sortColumn, setSortColumn] = useState<keyof Customer>("name")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
    const router = useRouter()
    // Filter customers based on search input

    const filteredCustomers = customers ?? [].filter(
        (customer) =>
            customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer?.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    )


    // Sort customers based on selected column and direction
    const sortedCustomers = [...filteredCustomers].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1
        if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1
        return 0
    })

    const handleSort = (column: keyof Customer) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortColumn(column)
            setSortDirection("asc")
        }
    }

    const handleViewDetails = (id: number) => {
        router.push(`/customers/${id}`)
    }

    const handleEditCustomer = (id: number) => {
        console.log(`Edit customer with id: ${id}`)
    }

    const handleDeleteCustomer = (id: number) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            console.log(`Delete customer with id: ${id}`)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Müstərilər</CardTitle>
                <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-gray-500"/>
                    <Input
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>
                                    <Button variant="ghost" onClick={() => handleSort("name")}>
                                        Name
                                        <ArrowUpDown className="ml-2 h-4 w-4"/>
                                    </Button>
                                </TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead className="w-[120px]">
                                    <Button variant="ghost" onClick={() => handleSort("totalDebt")}>
                                        Total Debt
                                        <ArrowUpDown className="ml-2 h-4 w-4"/>
                                    </Button>
                                </TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading
                                ? Array.from({length: 5}).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Skeleton className="h-4 w-8"/>
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-[200px]"/>
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-[300px]"/>
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-[150px]"/>
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-16"/>
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-8 w-8 rounded-full"/>
                                        </TableCell>
                                    </TableRow>
                                ))
                                : sortedCustomers.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell className="font-medium">{customer.id}</TableCell>
                                        <TableCell>
                                            <Link
                                                href={`/customer/${customer.id}`}
                                                className="font-semibold text-lg text-primary hover:underline"
                                            >
                                                {customer.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{customer.description}</TableCell>
                                        <TableCell>{customer.address || "N/A"}</TableCell>
                                        <TableCell>
                                            <Badge variant={customer.totalDebt > 0 ? "destructive" : "secondary"}>
                                                {customer.totalDebt.toFixed(2)}₼
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4"/>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleViewDetails(customer.id)}>
                                                        View details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator/>
                                                    <DropdownMenuItem onClick={() => handleEditCustomer(customer.id)}>
                                                        Edit customer
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDeleteCustomer(customer.id)}>
                                                        Delete customer
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}