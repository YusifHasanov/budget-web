"use client"

import {useEffect, useState} from "react"
import {CustomerList} from "@/components/CustomerList"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {DateRangePicker} from "@/components/DateRangePicker"
import {AddCustomerForm} from "@/components/AddCustomerForm"
import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import {Skeleton} from "@/components/ui/skeleton"
import {addDays} from "date-fns"
import {PlusCircle} from "lucide-react"

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
        setI(prev => prev + 1);
        // You might want to refresh the customer list here
    }

    useEffect(() => {
        fetch(`/base-api/customer`)
            .then(res => res.json())
            .then(data => {
                console.log("data", data.data)
                setResponseData(data.data)
                setIsLoading(false)
                console.log(data.data)
            })
            .catch(err => console.log(err))

    }, [i])

    useEffect(() => {
        fetch(`/base-api/report/total-cashflow`)
            .then(res => res.json())
            .then(data => {
                setTotalData(data.data)
                setIsTotalLoading(false)
            })
            .catch(err => console.log(err))
    }, [i])


    return (
        <main className="container mx-auto p-4 space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Customer Management</h1>
                <div className="flex items-center space-x-4">
                    <DateRangePicker date={dateRange} setDate={setDateRange as any}/>
                    <Dialog open={isAddCustomerDialogOpen} onOpenChange={setIsAddCustomerDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4"/>
                                Yeni müştəri əlavə et
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Yeni müştəri əlavə et</DialogTitle>
                            </DialogHeader>
                            <AddCustomerForm onCustomerAdded={handleCustomerAdded}/>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                {totalData?.totalPaid && totalData?.totalDebt && (
                    <>
                        <TotalCard title="Ümumi Gəlir" amount={totalData?.totalPaid} type="income"
                                   isLoading={isTotalLoading}/>
                        <TotalCard title="Fərq" amount={totalData?.totalPaid - totalData?.totalDebt} type="outcome"
                                   isLoading={isTotalLoading}/>
                        <TotalCard title="Ümumi Xərc" amount={totalData?.totalDebt} type="outcome"
                                   isLoading={isTotalLoading}/>
                    </>
                )}
            </div>
            <CustomerList customers={responseData} isLoading={isLoading}/>
        </main>
    )
}

function TotalCard({
                       title,
                       amount,
                       type,
                       isLoading,
                   }: { title: string; amount: number; type: "income" | "outcome"; isLoading: boolean }) {
    console.log(type)
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Skeleton className="h-8 w-24"/>
                ) : (
                    <p className={`text-3xl font-bold ${type === "income" ? "text-green-600" : "text-red-600"}`}>
                        {amount.toFixed(2)}₼
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

