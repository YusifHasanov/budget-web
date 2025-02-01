import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  // In a real application, you would use these dates to filter the data
  console.log("Fetching customers for date range:", { from, to })

  // Mock data
  const customers = [
    {
      id: 1,
      name: "borclu",
      description: "a kopoglu",
      address: null,
      totalDebt: 22,
    },
    {
      id: 2,
      name: "string",
      description: "string",
      address: "string",
      totalDebt: 0.04,
    },
    {
      id: 3,
      name: "hahahm",
      description: "aeee pulumu ver",
      address: "zabrat",
      totalDebt: 19,
    },
    {
      id: 4,
      name: "Vagif",
      description: "string",
      address: "string",
      totalDebt: 261.98,
    },
  ]

  return NextResponse.json({
    isSuccess: true,
    message: "Operation successful",
    data: customers,
    errors: null,
    statusCode: 200,
    traceId: null,
    errorCode: null,
  })
}

export async function POST(request: Request) {
  const body = await request.json()

  // Validate the request body
  if (!body.name || typeof body.totalDebt !== "number") {
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Invalid request body",
        data: null,
        errors: ["Name is required", "Total debt must be a number"],
        statusCode: 400,
        traceId: null,
        errorCode: "INVALID_REQUEST",
      },
      { status: 400 },
    )
  }

  // In a real application, you would save this new customer to your database
  console.log("Adding new customer:", body)

  // Simulating a successful response
  return NextResponse.json(
    {
      isSuccess: true,
      message: "Customer added successfully",
      data: { id: Math.floor(Math.random() * 1000), ...body },
      errors: null,
      statusCode: 201,
      traceId: null,
      errorCode: null,
    },
    { status: 201 },
  )
}

