import Button from '../button'

// this is the budget page
const Budget = () => {
  return (
    <>
      <div className="font-josefin container">
        <div className="py-4 font-bold text-3xl">
          <p>Track Your Money 💸</p>
        </div>
        <div className="flex md:flex-row flex-col md:gap-6">
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
          <Button onClick={() => {}} children={'Update'} />
        </div>
      </div>
    </>
  )
}

export default Budget
