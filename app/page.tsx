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
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
                {/* Başlık */}
                <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
                    Customer Management
                </h1>

                {/* Tarih Aralığı Seçici */}
                <div className={"flex sm:flex-row flex-col"}>

                    <div className="w-full mb-2 sm:w-auto">
                        <DateRangePicker date={dateRange} setDate={setDateRange as any}/>
                    </div>

                    {/* Dialog */}
                    <Dialog open={isAddCustomerDialogOpen} onOpenChange={setIsAddCustomerDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto">
                                <PlusCircle className="mr-2 h-4 w-4"/>
                                Yeni müştəri əlavə et
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="w-full sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Yeni müştəri əlavə et</DialogTitle>
                            </DialogHeader>
                            <AddCustomerForm onCustomerAdded={handleCustomerAdded}/>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className="">

                <Card className="shadow-lg ml-auto mr-auto rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-center">Maliyyə Xülasəsi</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                        {[
                            {title: "Ümumi Gəlir", amount: totalData.totalPaid, type: "income"},
                            {title: "Fərq", amount: totalData.totalPaid - totalData.totalDebt, type: "outcome"},
                            {title: "Ümumi Xərc", amount: totalData.totalDebt, type: "outcome"},
                        ].map(({title, amount, type}, index) => (
                            <div key={index} className="flex sm:flex-col w-full justify-between items-center">
                                <span className="text-gray-600 text-sm">{title}</span>
                                {isTotalLoading ? (
                                    <Skeleton className="h-8 w-24 mt-2" />
                                ) : (
                                    <p className={`text-2xl font-bold mt-1 ${type === "income" ? "text-green-600" : "text-red-600"}`}>
                                        {amount.toFixed(2)}₼
                                    </p>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
                {totalData?.totalPaid && false && totalData?.totalDebt && (
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
        <Card className={"flex items-center"}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className={"p-0"}>
                {isLoading ? (
                    <Skeleton className="h-8 w-24"/>
                ) : (
                    <p className={`text-3xl p-0 font-bold ${type === "income" ? "text-green-600" : "text-red-600"}`}>
                        {amount.toFixed(2)}₼
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

