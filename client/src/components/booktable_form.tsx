import React, { useState } from 'react'
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material'
import { useEventStore, useUserStore } from '../global-store/store'
import Button from './button'
import useApi from '../hooks/use-api'
import useSnackbar from '../hooks/use-snackbar'
import { useParams } from 'react-router-dom'

const BookTableForm = () => {
  const callApi = useApi()
  const setSnackbar = useSnackbar()
  const { eventId } = useParams()
  const { event } = useEventStore((state) => state)
  const [formData, setFormData] = useState({ row: event?.EventTable?.total_row, column: event?.EventTable?.total_col, size: event?.EventTable?.table_size })
  const [allowBooking, setAllowBooking] = useState(event.bookTable)

  const handleRadioChange = (event) => {
    setAllowBooking(event.target.value)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { row, column, size } = formData

    try {
      const res = await callApi('/table/setup', 'POST', {
        eventId: Number(eventId),
        bookTable: allowBooking,
        totalRow: row,
        totalCol: column,
        tableSize: size,
      })

      if (res.status === 201) {
        setSnackbar({
          open: true,
          content: 'Table setup completed!',
          type: 'success',
        })
        window.location.reload()
      }
    } catch (error) {
      console.log(error)
      setSnackbar({
        open: true,
        content: 'Error setting up the table, try again!',
        type: 'error',
      })
    }
  }

  return (
    <div className="flex justify-center items-center py-4">
      <div className="border-1 border-primary-light px-12 py-8 border rounded-lg font-josefin">
        <div>
          <p className="font-bold text-3xl text-center">
            Seating Arrangements
          </p>
          <p className="text-center text-xl">
            Choose a proper number of tables so that your guests can book
            them.
          </p>
        </div>
        <div>
          <form
            className="flex flex-col justify-center items-center gap-3 py-8 w-full"
            onSubmit={handleSubmit}
          >
            <FormLabel id="demo-row-radio-buttons-group-label">
              <span className="font-josefin text-[18px]">
                Allow Table Booking
              </span>
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={allowBooking}
              onChange={handleRadioChange}
            >
              <FormControlLabel
                value={true}
                control={<Radio />}
                label="Yes"
                disableTypography={true}
              />
              <FormControlLabel
                value={false}
                control={<Radio />}
                label="No"
                disableTypography={true}
              />
            </RadioGroup>

            <div className='flex flex-col gap-1'>
              <label className="font-medium">Total Rows</label>
              <input
                className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 min-w-60 md:min-w-80 text-[14px] focus:outline-none"
                type="number"
                placeholder="Enter the number of tables in a row"
                name="row"
                value={formData.row}
                min={0}
                onChange={handleChange}
                required
                disabled={!allowBooking}
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label className="font-medium">Total Columns</label>
              <input
                className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 min-w-60 md:min-w-80 text-[14px] focus:outline-none"
                type="number"
                min={0}
                placeholder="Enter the number of tables in a column"
                name="column"
                value={formData.column}
                onChange={handleChange}
                required
                disabled={!allowBooking}
              />
            </div>
            <div className='flex flex-col gap-1'>
              <label className="font-medium">Total Size</label>
              <input
                className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 min-w-60 md:min-w-80 text-[14px] focus:outline-none"
                type="number"
                min={0}
                placeholder="Enter the size of each table"
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
                disabled={!allowBooking}
              />
            </div>
            <div>
              <button
                type="submit"
                className="bg-primary-light hover:bg-transparent focus:bg-transparent focus:bg-background-light my-2 px-4 py-1 border border-transparent hover:border-black rounded-full min-w-40 font-semibold text-lg text-white hover:text-black focus:outline-black focus:text-black transition-colors"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BookTableForm
