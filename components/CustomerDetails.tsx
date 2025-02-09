"use client"

import {useEffect, useState} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import {AddTransactionForm} from "@/components/AddTransactionForm"
import {EditTransactionForm} from "@/components/EditTransactionForm"
import {ArrowDownIcon, ArrowUpIcon, Edit2Icon, Trash2Icon} from "lucide-react"
import type {DateRange} from "react-day-picker"
import {Skeleton} from "@/components/ui/skeleton"
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

export function CustomerDetails({customerId, dateRange}: { customerId: string; dateRange: DateRange }) {
    const [details, setDetails] = useState(null as any)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedTransaction, setSelectedTransaction] = useState(null)

    useEffect(() => {
        fetchCustomerDetails()
    }, []) //Fixed useEffect dependency

    const fetchCustomerDetails = async () => {
        try {
            const res = await fetch(`/base-api/report/cashflow?customerId=${customerId}`)
            const data = await res.json()
            setDetails(data.data)
        } catch (err) {
            console.error(err)
        }
    }

    const handleTransactionAdded = () => {
        fetchCustomerDetails()
        setIsAddDialogOpen(false)
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
    }

    const handleTransactionDeleted = async () => {
        try {
            const response = await fetch(`/base-api/customer/reverse/${selectedTransaction.id}`, {
                method: "POST",
            })
            if (response.ok) {
                fetchCustomerDetails()
                setIsDeleteDialogOpen(false)
            } else {
                console.error("Failed to delete transaction")
            }
        } catch (error) {
            console.error("Error deleting transaction:", error)
        }
    }

    if (!details)
        return (
            <div className="flex flex-col gap-4">
                <Skeleton className="h-12 w-full"/>
                <Skeleton className="h-4 w-full"/>
                <Skeleton className="h-4 w-full"/>
            </div>
        )

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle> {details.name} {details.address}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-green-100 p-4 rounded-lg">
                            <p className="font-semibold text-green-800">Ümumi Gəlir</p>
                            <p className="text-2xl font-bold text-green-600">{details.totalPaid.toFixed(2)}₼</p>
                        </div>
                        <div className="bg-red-100 p-4 rounded-lg">
                            <p className="font-semibold text-red-800">Hazırki Borc</p>
                            <p className="text-2xl font-bold text-red-600">{details.currentDebt.toFixed(2)}₼</p>
                        </div>
                        <div className="bg-red-100 p-4 rounded-lg">
                            <p className="font-semibold text-red-800">Ümumi Verilən borc</p>
                            <p className="text-2xl font-bold text-red-600">{details.totalDebt.toFixed(2)}₼</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Transaksiyalar</CardTitle>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>Yenisini əlavə et</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Yeni Proses əlavə et</DialogTitle>
                            </DialogHeader>
                            <AddTransactionForm customerId={customerId} onTransactionAdded={handleTransactionAdded}/>
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
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {details.transactions.map((transaction: any, index: any) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {new Date(transaction.paymentDate).toLocaleString("en-GB", {
                                            hour12: false,
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </TableCell>
                                    <TableCell className={transaction.eventType === 0 ? "text-red-600" : ""}>
                                        {transaction.eventType === 0 ? (
                                            <span className="flex items-center">
                        <ArrowDownIcon className="mr-1" size={16}/>
                                                {transaction.amount.toFixed(2)}₼
                      </span>
                                        ) : null}
                                    </TableCell>
                                    <TableCell className={transaction.eventType === 1 ? "text-green-600" : ""}>
                                        {transaction.eventType === 1 ? (
                                            <span className="flex items-center">
                        <ArrowUpIcon className="mr-1" size={16}/>
                                                {transaction.amount.toFixed(2)}₼
                      </span>
                                        ) : null}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button variant="ghost" size="icon"
                                                    onClick={() => handleEditClick(transaction)}>
                                                <Edit2Icon className="h-4 w-4"/>
                                            </Button>
                                            <Button variant="ghost" size="icon"
                                                    onClick={() => handleDeleteClick(transaction)}>
                                                <Trash2Icon className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

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
                        <AlertDialogTitle>Are you sure you want to delete this transaction?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the transaction from the
                            database.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleTransactionDeleted}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}


// "use client"
//
// import { useEffect, useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { AddTransactionForm } from "@/components/AddTransactionForm"
// import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
// import type { DateRange } from "react-day-picker"
// import { Skeleton } from "@/components/ui/skeleton" // Skeleton bileşenini ekledik
//
//
// export function CustomerDetails({ customerId, dateRange }: { customerId: string; dateRange: DateRange }) {
//   const [details, setDetails] = useState(null as any)
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//
//   useEffect(() => {
//     fetchCustomerDetails()
//   }, [customerId])
//
//   const fetchCustomerDetails = async () => {
//     fetch(`/base-api/report/cashflow?customerId=${customerId}`)
//         .then(res => res.json())
//         .then(data => {
//           setDetails(data.data)
//         })
//         .catch(err => console.log(err))
//   }
//
//   const handleTransactionAdded = () => {
//     fetchCustomerDetails()
//     setIsDialogOpen(false)
//   }
//
//   if (!details) return (
//       <div className="space-y-6">
//         {/* Skeleton for Customer Summary */}
//         <Card>
//           <CardHeader>
//             <CardTitle><Skeleton className="h-6 w-40" /></CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-2 gap-4 text-center">
//               <Skeleton className="h-24 w-full rounded-lg" />
//               <Skeleton className="h-24 w-full rounded-lg" />
//             </div>
//           </CardContent>
//         </Card>
//
//         {/* Skeleton for Transactions Table */}
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between">
//             <CardTitle><Skeleton className="h-6 w-32" /></CardTitle>
//             <Skeleton className="h-8 w-40 rounded" />
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead><Skeleton className="h-4 w-20" /></TableHead>
//                   <TableHead><Skeleton className="h-4 w-20" /></TableHead>
//                   <TableHead><Skeleton className="h-4 w-20" /></TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {[...Array(2)].map((_, index) => (
//                     <TableRow key={index}>
//                       <TableCell><Skeleton className="h-4 w-32" /></TableCell>
//                       <TableCell><Skeleton className="h-4 w-20" /></TableCell>
//                       <TableCell><Skeleton className="h-4 w-20" /></TableCell>
//                     </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       </div>
//   )
//
//   return (
//       <div className="space-y-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Customer Summary</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-3 gap-4 text-center">
//               <div className="bg-green-100 p-4 rounded-lg">
//                 <p className="font-semibold text-green-800">Ümumi Gəlir</p>
//                 <p className="text-2xl font-bold text-green-600">{details.totalPaid.toFixed(2)}₼</p>
//               </div>
//               <div className="bg-red-100 p-4 rounded-lg">
//                 <p className="font-semibold text-red-800">Hazırki Borc</p>
//                 <p className="text-2xl font-bold text-red-600">{details.currentDebt.toFixed(2)}₼</p>
//               </div>
//               <div className="bg-red-100 p-4 rounded-lg">
//                 <p className="font-semibold text-red-800">Ümumi Verilən borc</p>
//                 <p className="text-2xl font-bold text-red-600">{details.totalDebt.toFixed(2)}₼</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between">
//             <CardTitle>Transaksiyalar</CardTitle>
//             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//               <DialogTrigger asChild>
//                 <Button>Yenisini əlavə et</Button>
//               </DialogTrigger>
//               <DialogContent>
//                 <DialogHeader>
//                   <DialogTitle>Yeni Proses əlavə et</DialogTitle>
//                 </DialogHeader>
//                 <AddTransactionForm customerId={customerId} onTransactionAdded={handleTransactionAdded} />
//               </DialogContent>
//             </Dialog>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Tarix</TableHead>
//                   <TableHead>Borc</TableHead>
//                   <TableHead>Ödəniş</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {details.transactions.map((transaction : any, index : any) => (
//                     <TableRow key={index}>
//                       <TableCell> {new Date(transaction.paymentDate).toLocaleString("en-GB", {
//                         hour12: false,
//                         year: "numeric",
//                         month: "2-digit",
//                         day: "2-digit",
//                         hour: "2-digit",
//                         minute: "2-digit"
//                       })}</TableCell>
//                       <TableCell className={transaction.eventType === 0 ? "text-red-600" : ""}>
//                         {transaction.eventType === 0 ? (
//                             <span className="flex items-center">
//                         <ArrowDownIcon className="mr-1" size={16} />{transaction.amount.toFixed(2)}₼
//                       </span>
//                         ) : null}
//                       </TableCell>
//                       <TableCell className={transaction.eventType === 1 ? "text-green-600" : ""}>
//                         {transaction.eventType === 1 ? (
//                             <span className="flex items-center">
//                         <ArrowUpIcon className="mr-1" size={16} />{transaction.amount.toFixed(2)}₼
//                       </span>
//                         ) : null}
//                       </TableCell>
//                     </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       </div>
//   )
// }