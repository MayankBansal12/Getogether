// import { Box, CssBaseline, Toolbar } from '@mui/material'
import { useEffect } from 'react'
import SideNav from '../components/sidenavs/primarynav'
import useApi from '../hooks/use-api'
import { useParams } from 'react-router-dom'
import { useEventStore, useUserStore } from '../global-store/store'
import { EventType, UserType } from '../global-types/model'
// import SidebarNav from '../components/sidenavs/secondarynav'

const Dash = () => {
  const { eventId } = useParams();
  const setEvent = useEventStore((state) => state.setEvent);
  const { user, setUser } = useUserStore(state => state);

  const fetchUserRole = async (eventId: Number) => {
    const res = await useApi("/event/user/role?eventId=" + eventId + "&userId=" + user.id);
    const role: string = res.data.role;

    setUser({ ...user, role });
  }

  const getEventDetails = async () => {
    const res = await useApi("/event/" + eventId, "GET");
    if (res) {
      const eventDetails: EventType = res.data.event;
      console.log("Event details: ", eventDetails);
      setEvent(eventDetails);
      fetchUserRole(eventDetails.id);
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
