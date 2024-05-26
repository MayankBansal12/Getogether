import { useState } from 'react'
import Button from '../button'
import AlertDialog from '../alert-dialog'
import useAlert from '../../hooks/use-alert'
import { Divider } from '@mui/material'

// this is the budget page
const Budget = () => {
  const [setAlert, closeAlert] = useAlert()

  const handleUpdate = () => {
    setAlert({
      open: true,
      title: 'Update Budget',
      text: 'Would you like to confirm the changes to your budget?',
      primaryButton: 'Confirm',
      secondaryButton: 'Cancel',
      primaryAction: () => {
        closeAlert()
      },
      secondaryAction: () => {},
      noSecondaryButton: true,
    })
  }
  return (
    <>
      <div className="font-josefin container">
        <div className="py-4 font-bold text-3xl">
          <p>Track Your Money 💸</p>
        </div>
        <div className="flex md:flex-row flex-col md:gap-6 pb-4">
          <div className="flex-grow flex-basis-0 bg-primary-light bg-opacity-25 my-4 px-4 py-4 rounded-xl min-w-56">
            <p className="my-2 text-3xl">Your Budget:</p>
            <p className="my-2 mt-4 text-5xl">$19</p>
          </div>
          <div className="flex-grow flex-basis-0 bg-accent-light bg-opacity-25 my-4 px-4 py-4 rounded-xl min-w-56">
            <p className="my-2 text-3xl">Amount Spent:</p>
            <p className="my-2 mt-4 text-5xl">$19</p>
          </div>
          <div className="flex-grow flex-basis-0 bg-[#18A33F] bg-opacity-25 my-4 px-4 py-4 rounded-xl min-w-56">
            <p className="my-2 text-3xl">Remaining Amount:</p>
            <p className="my-2 mt-4 text-5xl">$19</p>
          </div>
        </div>
        <Divider />
        <div className="py-8 font-bold text-3xl">
          <p>Update Budget </p>
        </div>
        <form>
          <input
            className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 min-w-60 md:min-w-80 focus:outline-none"
            type="text"
            placeholder="Budget"
            name="budge"
          />
          <br />
          <input
            className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 min-w-60 md:min-w-80 focus:outline-none"
            type="text"
            placeholder="Amount Spent"
            name="amount"
          />
          <br />
          <Button onClick={handleUpdate} children={'Update'} />
        </form>
      </div>
    </>
  )
}

export default Budget
