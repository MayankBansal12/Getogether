// Route for events related operations -> /event

import { Router, Request, Response } from 'express'
import prisma from '../db/db'
import authMiddleware from '../middlewares/user-middleware'
import { AuthReqType, UserReqType } from '../types/req'
import UploadImg from '../helper/upload-img'

const router = Router()

const flaskBackend = process.env.FLASK_BACKEND || 'http://localhost:6969'

interface CreateAllReq extends UserReqType {
  body: {
    name: string
    desc: string
    budget: number
    image: string
    subEvents: {
      name: string
      venue: string
      startTime: Date
      endTime: Date
    }[]
  }
}

// /event/all -> For fetching all events
router.get('/all', authMiddleware, async (req: UserReqType, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      where: {
        OR: [
          {
            EventParticipant: {
              some: {
                userId: req.user.id,
              },
            },
          },
          {
            hostId: req.user.id,
          },
        ],
      },
      include: {
        Host: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    })

    return res
      .status(200)
      .json({ message: 'Successfully fetched the event details!', events })
  } catch (error) {
    console.log('==/event/all\n', error)
    res.status(400).json({ message: 'Internal server error' })
  }
})

// /event/create -> For creating new event
router.post('/create', async (req: UserReqType, res: Response) => {
  const { name, desc } = req.body

  try {
    const newEvent = await prisma.event.create({
      data: {
        name: name,
        desc: desc,
        date: new Date(),
        hostId: req.user.id,
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

// /event/create-all -> For creating new event with all details
router.post(
  '/create-all',
  authMiddleware,
  async (req: CreateAllReq, res: Response) => {
    const { name, desc, budget, image, subEvents } = req.body
    if (!name || !desc || !subEvents) {
      return res.status(400).json({ error: 'Please fill all the details' })
    }

    try {
      let imageURL = ''
      if (image) imageURL = await UploadImg(image)

      const newEvent = await prisma.event.create({
        data: {
          name: name,
          desc: desc,
          date: new Date(),
          hostId: req.user.id,
          image: imageURL,
        },
      })
      const budgetCreated = await prisma.budget.create({
        data: {
          eventId: newEvent.id,
          spent: 0,
          totalAmount: budget || 0,
        },
      })

      const hostParticipant = await prisma.eventParticipant.create({
        data: {
          eventId: newEvent.id,
          userId: req.user.id,
          role: 'host',
          status: 1,
        },
      })

      const defaultGroups = [
        { name: 'Announcements', desc: 'Channel announcements' },
        { name: 'Vendor', desc: 'Vendor discussions' },
        { name: 'General', desc: 'General chat' },
        { name: 'Photos', desc: 'Share your photos' },
      ]

      const newSubEvents = await Promise.all(
        subEvents.map(async (subEvent) => {
          const newChannel = await prisma.channel.create({
            data: {
              eventId: newEvent.id,
              name: subEvent.name,
              venue: subEvent.venue,
              startTime: new Date(subEvent.startTime),
              endTime: new Date(subEvent.endTime),
              ChannelParticipant: {
                create: {
                  participantId: hostParticipant.id,
                },
              },
            },
          })

          // Create default groups for the new channel
          const groupPromises = defaultGroups.map(group =>
            prisma.group.create({
              data: {
                name: group.name,
                desc: group.desc,
                eventId: newEvent.id,
              },
            })
          )

          const createdGroups = await Promise.all(groupPromises)

          // Create GroupRelations
          const groupRelationPromises = createdGroups.map(group =>
            prisma.groupRelation.create({
              data: {
                groupId: group.id,
                channelId: newChannel.id,
              },
            })
          )

          await Promise.all(groupRelationPromises)

          return newChannel
        })
      )

      return res.status(201).json({ message: 'Events created successfully', newEvent, newSubEvents })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Failed to create event' })
    }
  },
)

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

// /event/invite -> Inviting a new user to event
router.post('/invite', async (req: Request, res: Response) => {
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

    if (existingParticipant) {
      return res
        .status(400)
        .json({ message: 'User already invited to the event' })
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
      .json({ message: 'User invited for the event!', participant })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to add user to event' })
  }
})

// /event/join -> For direct invitation to the user for the event
router.post('/join', async (req: Request, res: Response) => {
  const { userId, eventId, role } = req.body
  const status = 1

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

    if (existingParticipant) {
      return res
        .status(400)
        .json({ message: 'User already invited to the event' })
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
      .json({ message: 'User added to the event!', participant })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to add user to event' })
  }
})

// /event/respond -> User Accepting/Declining the invitation
// status -> accept 1 ,reject -1
router.post('/respond', async (req: Request, res: Response) => {
  const { userId, eventId, status } = req.body

  try {
    const participant = await prisma.eventParticipant.updateMany({
      where: {
        userId,
        eventId,
        status: 0,
      },
      data: {
        status: status,
      },
    })

    if (participant.count === 0) {
      return res
        .status(404)
        .json({ error: 'Invitation not found or already processed' })
    }

    return res
      .status(200)
      .json({ message: 'Successfully responded to Invitation!' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to respond to invitation for event' })
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
router
  .route('/user/role')
  .get(async (req: Request, res: Response) => {
    try {
      const { userId, eventId } = req.query;

      const participant = await prisma.eventParticipant.findFirst({
        where: {
          userId: Number(userId),
          eventId: Number(eventId),
        },
      });

      if (!participant) {
        return res.status(200).json({
          message: 'User is not a participant of the event',
          isParticipant: false,
        });
      }

      return res.status(200).json({
        message: 'Role for the user fetched!',
        role: participant.role,
        isParticipant: true,
        participant,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to get user role' });
    }
  })
  .put(async (req: Request, res: Response) => {
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
router.post(
  '/channel/create',
  authMiddleware,
  async (req: UserReqType, res: Response) => {
    const { eventId, name, desc, venue, startTime, endTime } = req.body

    if (!name || !desc || !venue) {
      return res.status(500).json({ error: 'All fields are not provided!' })
    }

    try {
      const participant = await prisma.eventParticipant.findFirstOrThrow({
        where: { userId: Number(req.user.id), eventId: Number(eventId) },
      })

      if (!participant) {
        return res.status(500).json({ error: 'User unauthorized!' })
      }

      const newChannel = await prisma.channel.create({
        data: {
          eventId,
          name,
          venue,
          desc,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
        },
      })

      const hostParticipant = await prisma.channelParticipant.create({
        data: {
          channelId: Number(newChannel.id),
          participantId: Number(participant.id),
        },
      })

      // Create default groups
      const defaultGroups = [
        { name: 'Announcements', desc: 'Channel announcements' },
        { name: 'Vendor', desc: 'Vendor discussions' },
        { name: 'General', desc: 'General chat' },
        { name: 'Photos', desc: 'Share your photos' },
      ]

      const groupPromises = defaultGroups.map(group =>
        prisma.group.create({
          data: {
            name: group.name,
            desc: group.desc,
            eventId: Number(eventId),
          },
        })
      )

      const createdGroups = await Promise.all(groupPromises)

      // Create GroupRelations
      const groupRelationPromises = createdGroups.map(group =>
        prisma.groupRelation.create({
          data: {
            groupId: group.id,
            channelId: newChannel.id,
          },
        })
      )

      await Promise.all(groupRelationPromises)

      return res.status(201).json({
        message: 'Successfully created the channel!',
        channel: newChannel,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Failed to create channel' })
    }
  },
)

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
      users.push({
        ...participant.User,
        role: participant.role,
        inviteStatus: participant.status,
      })
    })

    return res
      .status(200)
      .json({ messsage: 'Event Participants fetched!', users })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch event participants' })
  }
})

// /event/details -> For fetching basic event details
router.post("/details", async (req: Request, res: Response) => {
  const { eventId } = req.body;
  try {
    const event = await prisma.event.findUnique({
      where: { id: Number(eventId) },
      include: {
        Host: {
          select: { name: true, id: true }
        }
      }
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
          EventParticipant: {
            include: {
              User: true,
            },
          },
          Budget: true,
          EventTable: {
            include: {
              SingleTable: true
            }
          }
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

// /event/photos/:eventId -> For fetching all photos of an event
router.get('/photos/:eventId', async (req: Request, res: Response) => {
  const { eventId } = req.params

  if (!eventId)
    return res.status(400).json({ message: 'Event ID not provided' })

  try {
    const photos = await prisma.photo.findMany({
      where: { eventId: Number(eventId) },
      include: {
        PhotoParticipant: {
          include: {
            EventParticipant: true,
          },
        },
      },
    })

    if (!photos) {
      return res
        .status(200)
        .json({ message: 'No photos found for the event', data: [] })
    }

    res.status(200).json({ message: 'All event photos fetched!', data: photos })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch event photos' })
  }
})

interface AddPhotoReq extends UserReqType {
  body: {
    image: string
    eventId: string
  }
}

router.post(
  '/add-photos',
  authMiddleware,
  async (req: AddPhotoReq, res: Response) => {
    const { image, eventId } = req.body

    if (!image || !eventId)
      return res.status(400).json({ message: 'Image or Event ID not provided' })

    const img = await UploadImg(image)

    try {
      const photo = await prisma.photo.create({
        data: {
          eventId: Number(eventId),
          url: img,
          private: false,
          // Event: {
          //   connect: {
          //     id: Number(eventId),
          //   },
          // },
        },
      })

      const resp = fetch(flaskBackend + '/find-faces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: eventId,
          image,
          name: 'event',
          photo_id: photo.id,
        }),
      })

      res.status(201).json({ message: 'Photo added successfully!' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Failed to add photo' })
    }
  },
)

export default router
