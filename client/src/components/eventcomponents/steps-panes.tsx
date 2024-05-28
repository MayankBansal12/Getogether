import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Datepicker from 'react-tailwindcss-datepicker'
import useAlert from '../../hooks/use-alert'
import useSnackbar from '../../hooks/use-snackbar'
import { useNavigate } from 'react-router-dom'

const BACKEND = 'http://localhost:5000'

interface Props {
  subEvents: { name: string; venue: string; startTime: Date; endTime: Date }[]
  setSubEvents: React.Dispatch<
    React.SetStateAction<
      {
        name: string
        venue: string
        startTime: Date
        endTime: Date
      }[]
    >
  >
  eventData: {
    name: string
    image?: string
    budget?: number
    desc: string
  }
}

export default function StepsPanes({
  subEvents,
  setSubEvents,
  eventData,
}: Props) {
  const [activeStep, setActiveStep] = React.useState(0)
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean
  }>({})
  const [setAlert, closeAlert] = useAlert()
  const [Loading, setLoading] = React.useState(false)
  const setOpenSnackbar = useSnackbar()
  const navigate = useNavigate()

  const handleValueChange = (newValue) => {
    console.log('newValue:', newValue)
    const newSubEvents = [...subEvents]
    newSubEvents[activeStep]['startTime'] = newValue.startDate
    newSubEvents[activeStep]['endTime'] = newValue.endDate
    setSubEvents(newSubEvents)
  }

  async function createEvent() {
    try {
      setLoading(true)
      const response = await fetch(`${BACKEND}/event/create-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: eventData.name,
          desc: eventData.desc,
          budget: eventData.budget,
          image: eventData.image,
          subEvents,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        setOpenSnackbar({
          open: true,
          content: 'Event created successfully',
          type: 'success',
        })
        closeAlert()
        setLoading(false)
        navigate('/allevents')
      }
    } catch (error) {
      console.log(error)
      setOpenSnackbar({
        open: true,
        content: 'Error creating event, try again!',
        type: 'error',
      })
      closeAlert()
      navigate('/createEvent')
    } finally {
      setLoading(false)
    }
  }

  const totalSteps = () => {
    return subEvents.length
  }

  const completedSteps = () => {
    return Object.keys(completed).length
  }

  const isLastStep = () => {
    return activeStep === totalSteps() - 1
  }

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps()
  }

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
        // find the first step that has been completed
        subEvents.findIndex((step, i) => !(i in completed))
        : activeStep + 1
    setActiveStep(newActiveStep)

    if (newActiveStep === subEvents.length) {
      createEvent()
      setAlert({
        open: true,
        noSecondaryButton: true,
        primaryButton: 'Ok',
        title: 'Event Creation',
        text: 'Your event is being created',
        primaryAction: () => {
          closeAlert()
        },
      })
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleStep = (step: number) => () => {
    setActiveStep(step)
  }

  const handleComplete = () => {
    const newCompleted = completed
    newCompleted[activeStep] = true
    setCompleted(newCompleted)
    handleNext()
  }

  const handleReset = () => {
    setActiveStep(0)
    setCompleted({})
  }

  function changeField(value: string, field: string) {
    const newSubEvents = [...subEvents]
    newSubEvents[activeStep][field] = value
    setSubEvents(newSubEvents)
  }

  return (
    <Box sx={{ width: '90%', height: '90%' }}>
      <Stepper nonLinear activeStep={activeStep} alternativeLabel className="pt-2 pb-6">
        {subEvents.map((subEvent, index) => (
          <Step key={index} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {subEvent.name}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div className="h-[calc(100%-160px)]">
        {allStepsCompleted() ? (
          <div className="flex flex-col h-full justify-center items-center">
            <h1>{eventData.name}</h1>
            <h2>
              Great job, Your event is being created...
            </h2>
            <h3>You will redirected to the event dashboard once completed...#hold up</h3>
          </div>
        ) : (
          <React.Fragment>
            <h2 className="text-xl py-2">
              {subEvents[activeStep].name}
            </h2>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                pt: 2,
                height: '100%',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  border: '1px solid black',
                  height: '100%',
                  px: 4,
                }}
              >
                <div className="flex flex-col w-full h-full justify-center gap-8">
                  <div className="flex flex-col justify-center gap-2">
                    <label htmlFor="venue">Venue</label>
                    <input
                      type="text"
                      name="venue"
                      value={subEvents[activeStep].venue}
                      onChange={(e) => changeField(e.target.value, 'venue')}
                      className="border-primary-light bg-background-light text-[18px] my-1 px-2 py-1 border-b focus:border-b-2 min-w-60 md:min-w-80 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p>Select start and end dates</p>
                    <Datepicker
                      value={{
                        startDate: subEvents[activeStep].startTime,
                        endDate: subEvents[activeStep].endTime,
                      }}
                      onChange={handleValueChange}
                      showShortcuts={true}
                    />
                  </div>
                </div>
              </Box>
              <div className="flex justify-between my-2">
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                {activeStep !== subEvents.length - 1 ? (
                  <Button
                    onClick={() => {
                      handleComplete()
                      // handleNext()
                    }}
                    sx={{ mr: 1 }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      handleComplete()
                      // handleNext()
                    }}
                    sx={{ mr: 1 }}
                  >
                    Finish
                  </Button>
                )}
              </div>
            </Box>
          </React.Fragment>
        )}
      </div>
    </Box>
  )
}
