const Navbar = () => {
  return (
    <nav className="flex w-full h-[50px] justify-between items-center px-4 py-8 md:px-20 overflow-x-hidden	">
      {/* Logo */}
      <span className="text-4xl md:text-5xl text-center font-title">
        Get
        <span className="text-primary-light">ogether.</span>
      </span>
      {/* Items */}
      <span className="text-lg space-x-4 font-josefin">
        <span className="relative inline-block hover:underline hover:text-primary-light">
          About
        </span>
        <span className="relative inline-block hover:underline hover:text-primary-light">
          Contact
        </span>
      </span>
    </nav>
  )
}

export default Navbar
