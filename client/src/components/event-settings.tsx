import React from 'react'
import { useEventStore } from '../global-store/store'
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Switch,
  Select,
  MenuItem,
  Input,
} from '@mui/material'
const EventSettings = () => {
  const event = useEventStore((state) => state.event)

  return (
    <React.Fragment>
      <div className="flex flex-col min-h-[100vh] font-josefin">
        <main className="flex-1">
          <section className="bg-gray-100/40 dark:bg-gray-800/40 py-4 md:py-24 lg:py-32 w-1/2">
            <div className="gap-8 grid px-4 md:px-6 container">
              <h1 className="font-bold text-3xl">Events Settings</h1>
              <div className="gap-8 grid">
                <Card>
                  <p className="mx-4 my-4 font-bold text-xl">
                    Update the event details.
                  </p>
                  <CardContent className="gap-6 grid">
                    <div className="flex justify-between items-center space-x-4">
                      <div className="space-y-1">
                        <p className="font-medium text-lg">Event Name</p>
                      </div>
                      <p className="text-gray-500 text-lg dark:text-gray-400">
                        <Input placeholder={event.name} value={event.name} />{' '}
                      </p>
                    </div>
                    <div className="flex justify-between items-center space-x-4">
                      <div className="space-y-1">
                        <p className="font-medium text-lg">Event Date</p>
                      </div>
                      <p className="text-gray-500 text-lg dark:text-gray-400">
                        <Input
                          placeholder={new Date(event.date).toLocaleDateString(
                            'en-GB',
                            {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            },
                          )}
                          value={event.date}
                        />
                      </p>
                    </div>
                    <div className="flex justify-between items-center space-x-4">
                      <div className="space-y-1">
                        <p className="font-medium text-lg">Event Description</p>
                      </div>
                      <p className="text-gray-500 text-lg dark:text-gray-400">
                        <Input placeholder={event.desc} value={event.desc} />{' '}
                      </p>
                    </div>
                  </CardContent>
                  <div className="p-6 border-t">
                    <Button variant="contained">Save Changes</Button>
                  </div>
                </Card>
                {/* Notifications and Privacy Cards */}
              </div>
            </div>
          </section>
        </main>
      </div>
    </React.Fragment>
  )
}

export default EventSettings
