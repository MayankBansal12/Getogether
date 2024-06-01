import React from 'react'
import Button from './button'
import AlertDialog from './alert-dialog' // Import AlertDialog component
import { useAlertStore } from '../global-store/store'

const BudgetForm = () => {
  const handleUpdate = () => {}

  return (
    <>
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
    </>
  )
}

export default BudgetForm
