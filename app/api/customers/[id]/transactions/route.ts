import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()

  // In a real application, you would save this transaction to your backend
  console.log(`Adding transaction for customer ${params.id}:`, body)

  return NextResponse.json({
    isSuccess: true,
    message: "Transaction added successfully",
    data: null,
    errors: null,
    statusCode: 200,
    traceId: null,
    errorCode: null,
  })
}

