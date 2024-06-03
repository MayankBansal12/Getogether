import { useEffect, useState } from 'react'
import Button from '../button'
import useAlert from '../../hooks/use-alert'
import { Box, Divider, Modal, TableHead, TableRow, TableCell, TableBody, Table } from '@mui/material'
import { useEventStore, usePaymentStore } from '../../global-store/store'
import useApi from '../../hooks/use-api'
import { useParams } from 'react-router-dom'
import useSnackbar from '../../hooks/use-snackbar'
import { getDate } from '../../helpers/formatDate'


const Budget = () => {
  const { eventId } = useParams()
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const callApi = useApi()
  const setSnackbar = useSnackbar();
  const { payment, setPayment } = usePaymentStore(state => state);
  const event = useEventStore(state => state.event);
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState(event?.Budget?.totalAmount || 0);
  const [eventBudget, setEventBudget] = useState({
    totalAmount: 0,
    spent: 0
  });

  const editBudget = async (e) => {
    e.preventDefault();

    try {
      const res = await callApi("/event/budget", "PUT", { totalAmount: budget, eventId: Number(eventId) })
      if (res.status === 201) {
        setSnackbar({
          open: true,
          content: "Updated the Budget for the event!",
          type: 'success',
        })
        fetchBudgetDetails()
      }
    } catch (error) {
      console.log("error editing budget: ", error);
      setSnackbar({
        open: true,
        content: "Error updating the budget for the event!",
        type: 'error',
      })
    }
    handleClose()
  }

  const fetchBudgetDetails = async () => {
    try {
      const res = await callApi("/event/budget", "POST", { eventId: Number(eventId) })
      if (res.status === 200) {
        setEventBudget(res?.data?.budget)
      }
    } catch (error) {
      console.log("error fetching budget: ", error);
    }
  }

  const paymentDetails = async () => {
    setLoading(true);
    try {
      const res = await callApi("/payment", "POST", { eventId: Number(eventId) })
      if (res.status === 200) {
        setPayment(res?.data?.payments || [])
        console.log(res.data);
      }
    } catch (error) {
      console.log("error fetching payments: ", error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBudgetDetails()
    paymentDetails()
  }, [])

  return (

    <div className="font-josefin container">
      <div className="py-4 font-bold text-3xl">
        <p>Track Your Money 💸</p>
      </div>
      <div className="gap-6 grid grid-cols-1 md:grid-cols-3 pb-2">
        <div className="flex-grow text-center bg-gradient-to-tr from-[#3829bed9] to-[#8477ffd9] my-4 px-5 py-5 rounded-xl min-w-56 font-bold text-white">
          <p className="my-2 text-xl">Your Budget:</p>
          <p className="my-2 mt-4 text-2xl">₹ {eventBudget.totalAmount || 0}</p>
        </div>
        <div className="flex-grow text-center border-2 border-black my-4 px-5 py-5 rounded-xl min-w-56 font-bold">
          <p className="my-2 text-xl">Remaining Amount:</p>
          <p className="my-2 mt-4 text-2xl">₹ {eventBudget?.totalAmount - eventBudget?.spent || 0}</p>
        </div>
        <div className="flex-grow text-center bg-gradient-to-br from-[#3829bed9] to-[#8477ffd9] my-4 px-5 py-5 rounded-xl min-w-56 font-bold text-white">
          <p className="my-2 text-xl">Amount Spent:</p>
          <p className="my-2 mt-4 text-2xl">₹ {eventBudget?.spent || 0}</p>
        </div>
      </div>
      <div className="flex justify-center items-center w-full">
        <button className="bg-primary-light my-3 px-3 py-2 rounded-lg text-white" onClick={handleOpen}>
          Edit Budget
        </button>

        <Modal
          open={open}
          onClose={handleClose}
          className="flex justify-center items-center"
        >
          <Box className="flex flex-col gap-2 bg-white px-4 py-4 rounded-md w-1/2 h-fit">
            <h2 className="font-semibold text-lg">Edit Budget Details</h2>
            <h3 className="text-md">Enter any amount that represent your total budget for the event. You can change this amount later!</h3>
            <form
              className="flex flex-col justify-center items-center gap-4 w-full"
              onSubmit={editBudget}
            >
              <input
                placeholder="50000"
                className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 w-2/3 text-[18px] focus:outline-none"
                type="number"
                min={0}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                required
              />
              <button className="bg-primary-light my-3 px-3 py-2 rounded-md w-1/5 text-white">
                Edit
              </button>
            </form>
          </Box>
        </Modal>

      </div>
      <Divider className="py-2" />
      <div className="grid py-4">
        <div className="flex justify-between items-center py-4 font-bold text-3xl">
          <p>Recent Payments</p>
          <p>
            <Button onClick={paymentDetails} children={'Refresh'} />
          </p>
        </div>
        <Table className="dark:border-gray-800 border rounded-lg font-josefin overflow-x-auto">
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
              <TableCell>
                <p className="font-bold font-josefin text-xl">Status</p>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && <div className="text-center">Refreshing...</div>}

            {!loading && payment?.length === 0 ?
              <div className="text-center">No Payment Record to show!</div>
              :
              payment?.map(item => (
                <TableRow className="dark:border-gray-800 border-b" key={item.id}>
                  <TableCell className="px-4 py-3 text-sm">
                    {getDate(item.date)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">{item.amount}</TableCell>
                  <TableCell className="px-4 py-3 text-sm">{item.Payee.name}</TableCell>
                  <TableCell className="px-4 py-3 text-sm">{item.status === 1 ? "Completed" : "Pending"}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>
    </div>

  )
}

export default Budget
