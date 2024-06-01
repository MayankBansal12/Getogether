import { useState } from 'react'
import Button from '../button'
import AlertDialog from '../alert-dialog'
import useAlert from '../../hooks/use-alert'
import { Divider } from '@mui/material'
import BudgetForm from '../budget_form'
import { TableHead, TableRow, TableCell, TableBody, Table } from '@mui/material'

// this is the budget page
const Budget = () => {
  const [setAlert, closeAlert] = useAlert()

  const handleUpdate = () => {}
  return (
    <>
      <div className="font-josefin container">
        <div className="py-4 font-bold text-3xl">
          <p>Track Your Money 💸</p>
        </div>
        <div className="gap-6 grid grid-cols-1 md:grid-cols-3 pb-2">
          <div className="flex-grow bg-gradient-to-r from-indigo-500 to-[#4F3DBE] my-4 px-4 py-4 rounded-xl min-w-56 font-bold text-white">
            <p className="my-2 text-3xl">Your Budget:</p>
            <p className="my-2 mt-4 text-4xl">Rs.1,90,000</p>
          </div>
          <div className="flex-grow bg-gradient-to-r from-[#F85757] to-[#BF3A3A] my-4 px-4 py-4 rounded-xl min-w-56 font-bold text-white">
            <p className="my-2 text-3xl">Amount Spent:</p>
            <p className="my-2 mt-4 text-4xl">$19</p>
          </div>
          <div className="flex-grow bg-gradient-to-r from-[#AD00FF] to-[#7406A8] my-4 px-4 py-4 rounded-xl min-w-56 font-bold text-white">
            <p className="my-2 text-3xl">Remaining Amount:</p>
            <p className="my-2 mt-4 text-4xl">$19</p>
          </div>
        </div>
        <div className="flex justify-center items-center w-full">
          <Button onClick={() => {}} children={'Edit'} />
        </div>
        <Divider className="py-2" />
        <div className="grid py-4">
          <div className="flex justify-between items-center py-4 font-bold text-3xl">
            <p>Recent Payments</p>
            <p>
              <Button onClick={() => {}} children={'Refresh'} />
            </p>
          </div>
          <Table className="dark:border-gray-800 border rounded-lg font-josefin font-josefin overflow-x-auto">
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
                <TableCell className="px-4 py-3 text-sm">
                  March 1, 2023
                </TableCell>
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
      </div>
    </>
  )
}

export default Budget
