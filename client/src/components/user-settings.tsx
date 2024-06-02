import React from 'react'
import { useUserStore } from '../global-store/store'
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
const UserSettings = () => {
  const user = useUserStore((state) => state.user)

  return (
    <React.Fragment>
      <div className="flex flex-col min-h-[100vh] font-josefin">
        <main className="flex-1">
          <section className="bg-gray-100/40 dark:bg-gray-800/40 py-4 md:py-24 lg:py-32 w-1/2">
            <div className="gap-8 grid px-4 md:px-6 container">
              <h1 className="font-bold text-3xl">User Settings</h1>
              <div className="gap-8 grid">
                <Card>
                  <p className="mx-4 my-4 font-bold text-xl">
                    Update your details.
                  </p>
                  <CardContent className="gap-6 grid">
                    <div className="flex justify-between items-center space-x-4">
                      <div className="space-y-1">
                        <p className="font-medium text-lg">Your Name</p>
                      </div>
                      <p className="text-gray-500 text-lg dark:text-gray-400">
                        <Input placeholder={user.name} value={user.name} />{' '}
                      </p>
                    </div>
                    <div className="flex justify-between items-center space-x-4">
                      <div className="space-y-1">
                        <p className="font-medium text-lg">Email Id</p>
                      </div>
                      <p className="text-gray-500 text-lg dark:text-gray-400">
                        <Input placeholder={user.email} value={user.email} />{' '}
                      </p>
                    </div>
                    <div className="flex justify-between items-center space-x-4">
                      <div className="space-y-1">
                        <p className="font-medium text-lg">Your Bio</p>
                      </div>
                      <p className="text-gray-500 text-lg dark:text-gray-400">
                        <Input placeholder={user.about} value={user.about} />{' '}
                      </p>
                    </div>
                    <div className="flex justify-between items-center space-x-4">
                      <div className="space-y-1">
                        <p className="font-medium text-lg">Contact Number</p>
                      </div>
                      <p className="text-gray-500 text-lg dark:text-gray-400">
                        <Input placeholder={user.phone} value={user.phone} />{' '}
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

export default UserSettings
