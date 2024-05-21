// this for the payment section on the host side
import { TableHead, TableRow, TableCell, TableBody, Table } from '@mui/material'

export default function PaymentHistory() {
  return (
    <main className="flex flex-col gap-6 p-4 md:p-6 font-josefin">
      <div>
        <h1 className="font-bold text-2xl">
          View your past payments for this Event.
        </h1>
      </div>
      <div className="dark:border-gray-800 border rounded-lg font-josefin overflow-x-auto">
        <Table className="font-josefin">
          <TableHead>
            <TableRow>
              <TableCell>
                <p className="font-bold font-josefin text-xl">Date</p>
              </TableCell>
              <TableCell>
                <p className="font-bold font-josefin text-xl">Amount</p>
              </TableCell>
              <TableCell>
                <p className="font-bold font-josefin text-xl">Vendor</p>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow className="dark:border-gray-800 border-b">
              <TableCell className="px-4 py-3 text-sm">May 20, 2023</TableCell>
              <TableCell className="px-4 py-3 text-sm">$9.99</TableCell>
              <TableCell className="px-4 py-3 text-sm">Arghya</TableCell>
            </TableRow>
            <TableRow className="dark:border-gray-800 border-b">
              <TableCell className="px-4 py-3 text-sm">
                April 15, 2023
              </TableCell>
              <TableCell className="px-4 py-3 text-sm">$9.99</TableCell>
              <TableCell className="px-4 py-3 text-sm">Mayank</TableCell>
            </TableRow>
            <TableRow className="dark:border-gray-800 border-b">
              <TableCell className="px-4 py-3 text-sm">March 1, 2023</TableCell>
              <TableCell className="px-4 py-3 text-sm">$9.99</TableCell>
              <TableCell className="px-4 py-3 text-sm">Saakshi</TableCell>
            </TableRow>
            <TableRow className="dark:border-gray-800 border-b">
              <TableCell className="px-4 py-3 text-sm">
                February 10, 2023
              </TableCell>
              <TableCell className="px-4 py-3 text-sm">$9.99</TableCell>
              <TableCell className="px-4 py-3 text-sm">Tom</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </main>
  )
}
