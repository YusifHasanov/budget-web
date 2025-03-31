import CustomerPage from "@/components/CustomerPage"

// export async function generateStaticParams() {
// const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/customer/ids`,{
//     method: "GET",
//     headers: {
//         "Content-Type": "application/json"
//     },
// })
//
// const customerIds = await response.json()
// console.log("customerIds", customerIds)
// // Return an array of params for all dynamic routes
//
// const params = [];
// for (const id of customerIds.data) {
//     params.push({ id: `${id}` });
// }
// return [];
// }

const Page = ({ params }) => {
  return <CustomerPage params={params} />
}

export default Page

