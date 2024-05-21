import Button from './button'

export default function Chat() {
  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-4">
            <div className="flex items-start">
              <img
                alt="User Avatar"
                className="mr-3 rounded-full w-8 h-8"
                src="/placeholder.svg"
              />
              <div>
                <p className="font-medium">John Doe</p>
                <p className="bg-gray-100 p-3 rounded-lg">
                  Great, let's connect later today. I have a few things I'd like
                  to discuss with you.
                </p>
              </div>
            </div>
            <div className="flex justify-end items-start">
              <div>
                <p className="font-medium">Jane Smith</p>
                <p className="bg-primary-light p-3 rounded-lg text-white">
                  Sounds good, I'll be available after 4 pm. Talk to you then!
                </p>
              </div>
              <img
                alt="User Avatar"
                className="ml-3 rounded-full w-8 h-8"
                src="/placeholder.svg"
              />
            </div>
            <div className="flex items-start">
              <img
                alt="User Avatar"
                className="mr-3 rounded-full w-8 h-8"
                src="/placeholder.svg"
              />
              <div>
                <p className="font-medium text-gray-500">John Doe</p>
                <p className="bg-gray-100 p-3 rounded-lg">
                  Hey, how's it going? I wanted to follow up on our last
                  conversation.
                </p>
              </div>
            </div>
            <div className="flex justify-end items-start">
              <div>
                <p className="font-medium text-gray-500">Jane Smith</p>
                <p className="bg-primary-light p-3 rounded-lg text-white">
                  Hi John, I'm doing well, thanks for asking. I'm free to chat
                  whenever you're available.
                </p>
              </div>
              <img
                alt="User Avatar"
                className="ml-3 rounded-full w-8 h-8"
                src="/placeholder.svg"
              />
            </div>
          </div>
        </div>
        <div className="bottom-4 sticky flex items-center bg-gray-100 px-4 py-3">
          <input
            className="flex-1 border-primary-light px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-light"
            placeholder="Type your message..."
            type="text"
          />
          <div className="mx-2">
            <Button
              children={'Send'}
              onClick={() => {
                console.log('sent')
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
