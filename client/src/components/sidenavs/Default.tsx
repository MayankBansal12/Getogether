//  this is the Default page for the host

import { useEventStore } from "../../global-store/store"

const Default = () => {

  const event = useEventStore(state => state.event)

  return (
    <div className="flex flex-col justify-center items-center py-4 w-full h-[60vh] font-josefin">
      <p className="font-bold text-3xl">
        Welcome to{' '}
        <span className="font-medium font-title text-4xl text-center md:text-5xl">
          Get
          <span className="text-primary-light">ogether.</span>
        </span>
      </p>
      <p className="py-4 font-medium text-lg text-dull underline text-center">This is the dashboard for your {event?.name} event</p>
      <p className="font-medium text-dull text-xl">
        All you need to manage your event at a single place.
      </p>
      <p className="py-4 font-medium text-md text-dull text-center">
        You can create, edit, delete sub events, groups, add/remove participants and manage your budget and payments.
      </p>

    </div>
  )
}
export default Default
