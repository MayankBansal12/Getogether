import React from 'react'

const CalenderDefault = () => {
  return (
    <React.Fragment>
      <div className="flex flex-col justify-center items-center py-4 w-full h-[60vh] font-josefin">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="my-4 size-24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z"
          />
        </svg>

        <p className="font-bold text-3xl">
          Let your guest know the event timings.
        </p>
        <p className="py-4 font-medium text-center text-dull text-lg underline">
          This is the Event Schedule section for your event.
        </p>
        <p className="font-medium text-dull text-xl">
          Click on the Subevent inorder to read the details.
        </p>
      </div>
    </React.Fragment>
  )
}

export default CalenderDefault
