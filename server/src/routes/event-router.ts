// Route for events related operations -> /event

import { Router, Request, Response } from 'express'
import prisma from '../db/db'

const router = Router()

// /event/create -> For creating new event
router.post('/create', async (req: Request, res: Response) => {
  const { name, desc } = req.body

  try {
    const newEvent = await prisma.event.create({
      data: {
        name: name,
        desc: desc,
        date: new Date(),
      },
    })

    return res
      .status(201)
      .json({ message: 'Successfully fetched the event details!', newEvent })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create event' })
  }
})

// /event/list -> For listing all sub events (and groups if param passed)
router.post('/list', async (req: Request, res: Response) => {
  try {
    const { eventId, includeGroup } = req.body

    const events = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        Channel: {
          include: {
            ChannelService: true,
            ChannelParticipant: true,
            GroupRelation: includeGroup
              ? {
                  include: {
                    Group: true,
                  },
                }
              : false,
          },
        },
      },
    })

    res.json({ message: 'All event list fetched!', events })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ error: 'An error occurred while fetching the events' })
  }
})

// /event/join -> Inviting a new user to event
router.post('/join', async (req: Request, res: Response) => {
  const { userId, eventId, role } = req.body
  const status = 0

  try {
    // Check if the participant already exists
    const existingParticipant = await prisma.eventParticipant.findUnique({
      where: {
        UserEventUnique: {
          userId,
          eventId,
        },
      },
    })

    // const existingParticipant = await prisma.eventParticipant.findUnique({
    //   where: {
    //     userId,
    //     eventId,
    //   },
    // })

    if (existingParticipant) {
      return res
        .status(400)
        .json({ message: 'User already added to the event' })
    }

    const participant = await prisma.eventParticipant.create({
      data: {
        userId,
        eventId,
        role,
        status,
      },
    })

    return res
      .status(201)
      .json({ message: 'User added in the event!', participant })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to add user to event' })
  }
})

// /event/accept -> User Accepting/Declining the invitation
router.post('/accept', async (req: Request, res: Response) => {
  const { userId, eventId } = req.body

  try {
    const participant = await prisma.eventParticipant.updateMany({
      where: {
        userId,
        eventId,
        status: 0,
      },
      data: {
        status: 1,
      },
    })

    if (participant.count === 0) {
      return res
        .status(404)
        .json({ error: 'Invitation not found or already processed' })
    }

    return res.status(200).json({ message: 'Invitation accepted!' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to accept invitation to event' })
  }
})

// /event/decline -> User Declined the invitation
router.post('/decline', async (req: Request, res: Response) => {
  const { userId, eventId } = req.body

  try {
    const participant = await prisma.eventParticipant.updateMany({
      where: {
        userId,
        eventId,
        status: 0,
      },
      data: {
        status: -1,
      },
    })

    if (participant.count === 0) {
      return res
        .status(404)
        .json({ error: 'Invitation not found or already processed' })
    }

    return res.status(200).json({ message: 'Invitation declined!' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to decline invitation to event' })
  }
})

// /event/remove -> Removing a user from event
router.post('/remove', async (req: Request, res: Response) => {
  const { userId, eventId } = req.body

  try {
    const participant = await prisma.eventParticipant.deleteMany({
      where: {
        userId,
        eventId,
      },
    })

    return res.status(200).json({ message: 'User removed from the event!' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to remove user from event' })
  }
})

// /event/user/role -> Assigning/changing a user role
// role -> "host", "vendor", "guest"
router.put('/user/role', async (req: Request, res: Response) => {
  const { userId, eventId, role } = req.body

  try {
    const updatedParticipant = await prisma.eventParticipant.updateMany({
      where: {
        userId,
        eventId,
      },
      data: {
        role,
      },
    })

    return res
      .status(201)
      .json({ message: 'Role changed for the user!', updatedParticipant })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to update user role' })
  }
})

// /event/channel/create -> Creating a new sub evet inside a event
router.post('/channel/create', async (req: Request, res: Response) => {
  const { eventId, name, venue, startTime, endTime } = req.body

  try {
    const newChannel = await prisma.channel.create({
      data: {
        eventId,
        name,
        venue,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    })

    return res.status(201).json({
      message: 'Successfully created the channel!',
      channel: newChannel,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create channel' })
  }
})

// /event/participants -> Fetching all events participants
router.get('/participants', async (req: Request, res: Response) => {
  const { eventId } = req.query

  try {
    const participants = await prisma.eventParticipant.findMany({
      where: { eventId: Number(eventId as string) },
      include: {
        User: true,
      },
    })
    const users = []
    participants.map((participant) => {
      users.push({ ...participant.User, role: participant.role })
    })

    return res
      .status(200)
      .json({ messsage: 'Event Participants fetched!', users })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch event participants' })
  }
})

// /event/:eventId -> For fetching, editing, deleting event details with that id
router
  .route('/:eventId')
  .get(async (req: Request, res: Response) => {
    const { eventId } = req.params

    try {
      const event = await prisma.event.findUnique({
        where: { id: Number(eventId) },
        include: {
          Channel: true,
          EventParticipant: true,
        },
      })

      if (!event) {
        return res.status(404).json({ error: 'Event not found!' })
      }

      return res.status(200).json({ message: 'Event Details fetched!', event })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Failed to fetch event details' })
    }
  })
  .put(async (req: Request, res: Response) => {
    const { eventId } = req.params
    const { name, desc } = req.body

    try {
      const updatedEvent = await prisma.event.update({
        where: { id: Number(eventId) },
        data: {
          name,
          desc,
          date: new Date(),
        },
      })

      res.json(updatedEvent)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Failed to update event details' })
    }
  })
  .delete(async (req: Request, res: Response) => {
    const { eventId } = req.params

    try {
      await prisma.event.delete({
        where: { id: Number(eventId) },
      })

      res.status(204).send()
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Failed to delete event' })
    }
  })

export default router
