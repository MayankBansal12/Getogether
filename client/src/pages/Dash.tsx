// import { Box, CssBaseline, Toolbar } from '@mui/material'
import { useEffect } from 'react'
import SideNav from '../components/sidenavs/primarynav'
import useApi from '../hooks/use-api'
import { useParams } from 'react-router-dom'
import { useEventStore } from '../global-store/store'
// import SidebarNav from '../components/sidenavs/secondarynav'

const Dash = () => {
  const { eventId } = useParams();
  const setEvent = useEventStore((state) => state.setEvent)

  const getEventDetails = async () => {
    const res = await useApi("/event/" + eventId, "GET");
    if (res) {
      const eventDetails = res.data.event;
      console.log("Event details: ", eventDetails);
      setEvent(eventDetails);
    }
  }

  useEffect(() => {
    getEventDetails();
  }, [])

  return (
    <SideNav />
  )
}
export default Dash
