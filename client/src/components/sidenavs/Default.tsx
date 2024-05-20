//  this is the Default page for the host

const Default = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center py-4 w-full h-full font-josefin">
        <p className="font-bold text-3xl">
          Welcom to{' '}
          <span className="font-medium font-title text-4xl text-center md:text-5xl">
            Plan
            <span className="text-primary-light">it.</span>
          </span>
        </p>
        <p className="py-4 font-medium text-2xl text-dull underline">
          New Event Created.
        </p>
        <p className="font-medium text-dull text-xl">
          You can now manage all your events using a single Platform.
        </p>
      </div>
    </>
  )
}
export default Default
