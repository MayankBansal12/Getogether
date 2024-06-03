// this for the payment section on the host side
import { TableHead, TableRow, TableCell, TableBody, Table, Modal, Box, Avatar } from '@mui/material'
import { ListItemDecorator, Select, Option, Typography } from '@mui/joy';
import Button from '../button'
import { usePaymentStore, useUserStore } from '../../global-store/store'
import { getDate } from '../../helpers/formatDate';
import { PaymentType } from '../../global-types/model';
import useAlert from '../../hooks/use-alert';
import useApi from '../../hooks/use-api';
import useSnackbar from '../../hooks/use-snackbar';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function PaymentHistory() {
  const { payment, setPayment } = usePaymentStore(state => state);
  const [setAlert, closeAlert] = useAlert();
  const user = useUserStore(state => state.user);
  const callApi = useApi();
  const [record, setRecord] = useState({
    id: 0,
    amount: 0,
    payeeId: 0,
    status: 0
  })
  const { eventId } = useParams();
  const setSnackbar = useSnackbar();
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [vendors, setVendors] = useState([])
  const [editRecordName, setEditRecordName] = useState("")
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleEditOpen = () => setEditOpen(true)
  const handleEditClose = () => setEditOpen(false)

  const fetchPaymentDetails = async () => {
    try {
      const res = await callApi("/payment", "POST", { eventId: Number(eventId) })
      if (res.status === 200) {
        setPayment(res?.data?.payments || [])
        console.log(res.data);
      }
    } catch (error) {
      console.log("error fetching payments: ", error);
    }
  }

  const fetchVendors = async () => {
    try {
      const res = await callApi("/event/participants", "POST", { eventId: Number(eventId), role: "vendor" })
      if (res.status === 200) {
        setVendors(res.data.participants || [])
        console.log(res.data);
      }
    } catch (error) {
      console.log("error fetching payments: ", error);
    }
  }

  const createPayment = async (e, isEdit = false) => {
    try {
      e.preventDefault()
      console.log("record: ", record)
      if (!record || !record.payeeId) {
        setSnackbar({
          open: true,
          content: 'Please fill all the details and try again!',
          type: 'info',
        })
        return
      }
      if (record.amount === 0) {
        setSnackbar({
          open: true,
          content: "Payment Amount can't be zero",
          type: 'info',
        })
        return
      }

      let uri = '/payment/create'
      let method = 'POST'

      if (isEdit) {
        uri = '/payment'
        method = 'PUT'
      }

      const res = await callApi(uri, method, {
        ...record,
        eventId: Number(eventId),
        payerId: Number(user.id),
      })

      if (res.status === 201 || res.status === 200) {
        setSnackbar({
          open: true,
          content: isEdit ? 'Payment Record edited!' : 'Payment Record created!',
          type: 'success',
        })
        fetchPaymentDetails()
      } else {
        setSnackbar({
          open: true,
          content: 'Error while performing the action for payment record!',
          type: 'error',
        })
      }
      handleEditClose()
      handleClose()
    } catch (error) {
      console.log(error)
      setSnackbar({
        open: true,
        content: 'Error while performing the action for sub event!',
        type: 'error',
      })
    }
  }

  const deletePayment = async (item: PaymentType) => {
    if (!item) {
      setSnackbar({
        open: true,
        content: 'Error, try again after refreshing the page!',
        type: 'warning',
      })
      return
    }
    try {
      const res = await callApi('/payment', 'DELETE', {
        eventId: Number(item.eventId),
        paymentId: Number(item.id)
      })
      if (res.status === 204) {
        setSnackbar({
          open: true,
          content: 'Payment Record deleted!',
          type: 'success',
        })
        fetchPaymentDetails()
      }
    } catch (error) {
      console.log(error)
      setSnackbar({
        open: true,
        content: 'Error deleting payment record!',
        type: 'error',
      })
    }
    closeAlert()
  }

  const openDelete = (item: PaymentType) => {
    setAlert({
      open: true,
      title: `Delete payment record for @${item?.Payee?.name}`,
      text: 'Would you like to delete this payment?',
      primaryButton: 'Confirm',
      secondaryButton: 'Cancel',
      primaryAction: () => {
        deletePayment(item)
      },
      secondaryAction: () => {
        closeAlert()
      },
    })
  }

  // fetch vendors when create payment is clicked
  useEffect(() => {
    if (open) {
      fetchVendors()
    }
  }, [open])

  useEffect(() => {
    fetchPaymentDetails()
  }, [])

  useEffect(() => {
    console.log("vendors: ", vendors)
  }, [vendors])

  return (
    <main className="flex flex-col gap-6 p-4 md:p-6 font-josefin">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl">
          View your past payments for this Event.
        </h1>
        <Button
          onClick={handleOpen}
          children={'+ New Payment '}
        />
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        className="flex justify-center items-center"
      >
        <Box className="flex flex-col gap-2 bg-white px-4 py-4 rounded-md w-1/2 h-fit">
          <h2 className="font-semibold text-lg">Create Payment Record</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 pt-1 pb-4">
              <h2>
                The amount will be shown as amount spent despite the payment status
              </h2>
              <h3>
                You can edit the amount and status later not the vendor!
              </h3>
            </div>
            <form
              className="flex flex-col justify-center gap-3 w-full"
              onSubmit={(e) => createPayment(e, false)}
            >
              <div className="flex flex-col gap-1">
                <label className="font-medium">Payment Amount</label>
                <input
                  placeholder="2000"
                  className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 w-4/5 text-[18px] focus:outline-none"
                  type="number"
                  min={0}
                  value={record.amount}
                  onChange={(e) =>
                    setRecord((prev) => ({ ...prev, amount: Number(e.target.value) }))
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-medium">Select Vendor</label>
                <select title="Select Vendor"
                  className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 w-4/5 text-[18px] focus:outline-none"
                  value={record.payeeId} onChange={(e) => setRecord((prev) => ({ ...prev, payeeId: Number(e.target.value) }))}>
                  <option value={0} disabled>Select an option</option>
                  {vendors && vendors.map((data) => (
                    <option value={data?.User?.id} key={data.id}>{data?.User?.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-medium">Select Payment Status</label>
                <select title="Select Vendor" value={record.status}
                  className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 w-4/5 text-[18px] focus:outline-none"
                  onChange={(e) => setRecord((prev) => ({ ...prev, status: Number(e.target.value) }))}>
                  <option value={-1} disabled>Select an option</option>
                  <option value={0}>Pending</option>
                  <option value={1}>Completed</option>
                </select>
              </div>

              <button className="bg-primary-light my-3 px-3 py-2 rounded-md w-1/5 text-white">
                Create
              </button>
            </form>
          </div>
        </Box>
      </Modal>

      <Modal
        open={editOpen}
        onClose={handleEditClose}
        className="flex justify-center items-center"
      >
        <Box className="flex flex-col gap-2 bg-white px-4 py-4 rounded-md w-3/5 h-fit">
          <h2 className="mb-4 font-semibold text-lg">Edit Payment Record</h2>
          <h3 className="font-medium">Edit Payment for Vendor:- {editRecordName}</h3>
          <div className="flex flex-col gap-4">
            <form
              className="flex flex-col justify-center gap-4 w-full"
              onSubmit={(e) => createPayment(e, true)}
            >
              <div className="flex flex-col gap-1">
                <label className="font-medium">Payment Amount</label>
                <input
                  placeholder="2000"
                  className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 w-4/5 text-[18px] focus:outline-none"
                  type="number"
                  min={0}
                  value={record.amount}
                  onChange={(e) =>
                    setRecord((prev) => ({ ...prev, amount: Number(e.target.value) }))
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-medium">Select Payment Status</label>
                <select title="Select Vendor" value={record.status}
                  className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 w-4/5 text-[18px] focus:outline-none"
                  onChange={(e) => setRecord((prev) => ({ ...prev, status: Number(e.target.value) }))}>
                  <option value={-1} disabled>Select an option</option>
                  <option value={0}>Pending</option>
                  <option value={1}>Completed</option>
                </select>
              </div>
              <button className="bg-primary-light my-3 px-3 py-2 rounded-md w-1/5 text-white">
                Edit
              </button>
            </form>
          </div>
        </Box>
      </Modal>

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
              <TableCell>
                <p className="font-bold font-josefin text-xl">Status</p>
              </TableCell>
              <TableCell>
                <p className="font-bold font-josefin text-xl"></p>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payment?.length === 0 ? <div className="text-center">No Payments record to show!</div>
              :
              payment?.map((item) => (
                <TableRow key={item.id} className="dark:border-gray-800 border-b">
                  <TableCell className="px-4 py-3 text-sm">
                    {getDate(item?.date)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    {item?.amount}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    {item?.Payee?.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    {item.status === 1 ? "Completed" : "Pending"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    <div className="flex gap-1 font-josefin">
                      <button
                        className="hover:text-gray-500 transition-all cursor-pointer"
                        onClick={() => {
                          setRecord(item)
                          setEditRecordName(item?.Payee?.name)
                          handleEditOpen()
                        }}
                      >
                        Edit
                      </button>
                      <span>|</span>
                      <button
                        className="hover:text-gray-500 transition-all cursor-pointer"
                        onClick={() => openDelete(item)}
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </main >
  )
}
