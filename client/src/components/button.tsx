import React from 'react'

const Button = ({ onClick, children }) => {
  return (
    <button
      className="bg-primary-light hover:bg-transparent focus:bg-transparent focus:bg-background-light my-2 px-4 py-1 hover:border hover:border-black rounded-full min-w-40 font-semibold text-lg text-white hover:text-black focus:outline-black focus:text-black transition-colors"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
