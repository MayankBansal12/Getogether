import React from 'react'

const Button = ({ onClick, children }) => {
  return (
    <button
      className="min-w-40 px-4 py-1 my-2 text-lg bg-primary-light text-white font-semibold rounded-full hover:bg-transparent hover:text-black hover:border hover:border-black focus:outline-black focus:bg-transparent focus:text-black transition-colors focus:bg-background-light"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
