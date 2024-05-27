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
    image: string
    budget: number
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
      // console.log('eventData:', eventData)
      // console.log('subEvents:', subEvents)
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
    <Box sx={{ width: '100%', height: '100%' }}>
      <Stepper nonLinear activeStep={activeStep} alternativeLabel>
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
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              Great job, Your event is being created
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                pt: 2,
              }}
            >
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography sx={{ mt: 2, pt: 1, ml: 9, fontSize: '25px' }}>
              {subEvents[activeStep].name}
              {/* Step {activeStep + 1} */}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                pt: 2,
                height: '100%',
              }}
            >
              <Button
                // color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
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
                <div className="flex flex-col px-4 w-full h-full">
                  <div className="flex flex-col justify-center h-full">
                    <label htmlFor="venue">Venue</label>
                    <input
                      type="text"
                      name="venue"
                      value={subEvents[activeStep].venue}
                      onChange={(e) => changeField(e.target.value, 'venue')}
                      className="border-2 px-1 py-1"
                    />
                  </div>
                  <div className="flex flex-col h-full">
                    <p className="ml-1">Select start and end dates</p>
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
              {/* {activeStep !== subEvents.length &&
                (completed[activeStep] ? (
                  <Typography
                    variant="caption"
                    sx={{ display: 'inline-block' }}
                  >
                    Step {activeStep + 1} already completed
                  </Typography>
                ) : (
                  <Button onClick={handleComplete}>
                    {completedSteps() === totalSteps() - 1
                      ? 'Finish'
                      : 'Complete Step'}
                  </Button>
                ))} */}
            </Box>
          </React.Fragment>
        )}
      </div>
    </Box>
  )
}
