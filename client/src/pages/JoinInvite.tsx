import React, { useEffect, useState } from 'react'
import monkey from '../assets/monkey.png'
import bday from '../assets/bday.png'
import EventBox from '../components/eventcomponents/eventbox'
import Button from '../components/button'
import { useNavigate, useParams } from 'react-router-dom'
import { useUserStore } from '../global-store/store'
import useApi from '../hooks/use-api'
import useSnackbar from '../hooks/use-snackbar'

const BACKEND = import.meta.env.VITE_SERVER

interface SingleEvent {
    id: number
    name: string
    desc: string
    date: string
    hostId: number
    image: string
    Host: {
        name: string
        id: number
    }
}

// This is where the user will be redirected after login
const JoinInvite = () => {
    const navigate = useNavigate()
    const callApi = useApi()
    const user = useUserStore((state) => state.user)
    const { eventId } = useParams();
    const [event, setEvent] = useState<SingleEvent>(null)
    const setSnackbar = useSnackbar()

    const fetchEvent = async () => {
        try {
            const res = await callApi("/event/details", "POST", { eventId });
            setEvent(res?.data?.event)
        } catch (error) {
            console.log("error: ", error);
        }
    };

    const handleJoin = async () => {
        try {
            const res = await callApi("/event/join", "POST", { eventId: Number(eventId), userId: user.id, role: "guest" })
            if (res.status === 201) {
                setSnackbar({
                    open: true,
                    content: 'You are added to the event!',
                    type: 'success',
                });
                navigate("/event/" + eventId);
            }
        } catch (error) {
            console.log("Error: ", error);
            setSnackbar({
                open: true,
                content: 'Error adding user to event, refresh and try again!',
                type: 'error',
            });
        }
    }

    useEffect(() => {
        fetchEvent();
    }, []);

    return (
        <div className="flex flex-col justify-center items-center gap-4 py-10 w-full h-screen font-josefin">
            <div className="font-title text-3xl md:text-5xl">
                Get
                <span className="text-primary-light">ogether.</span>
            </div>

            <div className="flex flex-col justify-center items-center gap-2 p-4 rounded-lg">
                <img
                    src={user.profilePic || monkey}
                    className="border-4 border-primary-light rounded-2xl w-[130px] h-[125px]"
                    alt={user.name + ' profile pic'}
                />
                <span>{user.name}</span>
            </div>
            <div className="flex flex-col">
                <EventBox
                    image={event?.image.length > 0 ? event.image : bday}
                    title={event?.name}
                    date={new Date(event?.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    })}
                    host={event?.Host?.name}
                    onClick={null}
                />
            </div>
            <div className="flex justify-center gap-2 items-center my-4 w-full">
                <Button
                    onClick={() => {
                        navigate('/')
                    }}
                    children={'Cancel'}
                />
                <Button
                    onClick={handleJoin}
                    children={'+ Join Event'}
                />
            </div>
        </div>
    )
}

export default JoinInvite
