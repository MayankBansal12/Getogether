import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Switch,
  Select,
  MenuItem,
} from '@mui/material'
import { useState } from 'react'

export default function Appearance() {
  const [theme, setTheme] = useState('')
  const [font, setFont] = useState('')

  const handleThemeChange = (event) => {
    setTheme(event.target.value)
  }

  const handleFontChange = (event) => {
    setFont(event.target.value)
  }

  return (
    <div className="flex flex-col min-h-[100vh] font-josefin">
      <main className="flex-1">
        <section className="bg-gray-100/40 dark:bg-gray-800/40 py-12 md:py-24 lg:py-32 w-full">
          <div className="gap-8 grid px-4 md:px-6 container">
            <h1 className="font-bold text-3xl">Appearance</h1>
            <div className="gap-8 grid">
              <Card>
                <p className="mx-4 my-4 font-bold text-xl">
                  Customize the look and feel of your account.
                </p>
                <CardContent className="gap-6 grid">
                  <div className="flex justify-between items-center space-x-4">
                    <div className="space-y-1">
                      <p className="font-medium text-lg">Theme</p>
                      <p className="text-gray-500 text-lg dark:text-gray-400">
                        Choose a light or dark theme for your account.
                      </p>
                    </div>
                    <Select
                      value={'theme'}
                      className="w-[180px] text-black"
                      label="Light"
                    >
                      <MenuItem value="light">Light</MenuItem>
                      <MenuItem value="dark">Dark</MenuItem>
                      <MenuItem value="system">System</MenuItem>
                    </Select>
                  </div>
                  <div className="flex justify-between items-center space-x-4">
                    <div className="space-y-1">
                      <p className="font-medium text-lg">Font</p>
                      <p className="text-gray-500 text-lg dark:text-gray-400">
                        Choose a font for your account.
                      </p>
                    </div>
                    <Select
                      value={font}
                      onChange={handleFontChange}
                      className="w-[180px]"
                    >
                      <MenuItem value="system">System</MenuItem>
                      <MenuItem value="serif">Serif</MenuItem>
                      <MenuItem value="sans-serif">Sans-Serif</MenuItem>
                      <MenuItem value="monospace">Monospace</MenuItem>
                    </Select>
                  </div>
                  <div className="flex justify-between items-center space-x-4">
                    <div className="space-y-1">
                      <p className="font-medium text-lg">Accent Color</p>
                      <p className="text-gray-500 text-lg dark:text-gray-400">
                        Choose an accent color for your account.
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        className="rounded-full"
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#2196f3',
                          color: '#fff',
                        }}
                      />
                      <Button
                        className="rounded-full"
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#4caf50',
                          color: '#fff',
                        }}
                      />
                      <Button
                        className="rounded-full"
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#f44336',
                          color: '#fff',
                        }}
                      />
                      <Button
                        className="rounded-full"
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#9c27b0',
                          color: '#fff',
                        }}
                      />
                    </div>
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
  )
}
