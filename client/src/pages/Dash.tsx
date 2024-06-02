// import { Box, CssBaseline, Toolbar } from '@mui/material'
import { useEffect } from 'react'
import SideNav from '../components/sidenavs/primarynav'
import useApi from '../hooks/use-api'
import { useParams } from 'react-router-dom'
import { useEventStore, useUserStore } from '../global-store/store'
import { EventType, UserType } from '../global-types/model'
// import SidebarNav from '../components/sidenavs/secondarynav'

const Dash = () => {
  const { eventId } = useParams()
  const { user, setUser } = useUserStore((state) => state)
  const callApi = useApi()

  const fetchUserRole = async (eventId: Number) => {
    const res = await callApi('/event/user/role?eventId=' + eventId + '&userId=' + user.id)
    const role: string = res.data.role
    const participant = res.data.participant;

    setUser({ ...user, role, "participantId": participant.id })
  }

  useEffect(() => {
    fetchUserRole(Number(eventId));
  }, [eventId])

  return <SideNav />
}
export default Dash
