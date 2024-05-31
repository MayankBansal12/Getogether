// Router for channel(sub event) -> /channel
import { Router, Request, Response } from "express";
import prisma from "../db/db";
const router = Router();

// /channel -> For creating/editing that sub event 
router.route("/")
    .post(async (req: Request, res: Response) => {
        try {
            const { channelId, eventId } = req.body;
            if (!channelId || !eventId) {
                return res.status(401).json({ message: "Event id or Channel id missing!" });
            }
            const channel = await prisma.channel.findUnique({
                where: { id: Number(channelId), eventId: Number(eventId) },
                include: {
                    ChannelService: true,
                    GroupRelation: true,
                    ChannelParticipant: true,
                },
            });
            if (!channel) {
                return res.status(404).json({ message: "Channel not found!" });
            }
            return res.status(200).json({ message: "Successfully fetched the channel details!", channel });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    })
    .put(async (req: Request, res: Response) => {
        try {
            const { channelId, eventId, name, desc, venue, startTime, endTime } = req.body;

            if (!channelId || !eventId) {
                return res.status(401).json({ message: "Event id or Channel id missing!" });
            }

            const channel = await prisma.channel.update({
                where: { id: Number(channelId), eventId: Number(eventId) },
                data: { name, desc, venue, startTime, endTime },
            });
            return res.status(201).json({ message: "Successfully changed the channel details!", channel });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    })
    .delete(async (req: Request, res: Response) => {
        try {
            const { channelId, eventId } = req.body;

            if (!channelId || !eventId) {
                return res.status(401).json({ message: "Event id or Channel id missing!" });
            }

            await prisma.channel.delete({
                where: { id: Number(channelId), eventId: Number(eventId) },
            });
            res.status(204).json({ message: "Channel deleted successfully" });
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Internal server error" });
        }
    });

// /channel/group/create -> Creating a new group inside a sub event
router.post("/group/create", async (req: Request, res: Response) => {
    try {
        const { eventId, channelId, name, desc } = req.body;

        const group = await prisma.group.create({
            data: {
                name,
                desc,
                eventId,
            },
        });

        await prisma.groupRelation.create({
            data: {
                groupId: group.id,
                channelId: channelId,
            },
        });

        return res.status(201).json({ message: "Successfully created the group inside the channel!", group });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// /channel/user -> Adding /removing a user from sub event
// action -> "add" or "remove"
router.post("/user", async (req: Request, res: Response) => {
    try {
        const { channelId, userId, action } = req.body;

        if (action === "add") {
            const existingParticipant = await prisma.channelParticipant.findFirst({
                where: {
                    participantId: userId,
                    channelId: channelId,
                }
            });

            if (existingParticipant) {
                return res.status(400).json({ message: "User already in the channel!" });
            }

            const channelParticipant = await prisma.channelParticipant.create({
                data: {
                    channelId,
                    participantId: userId,
                },
            });
            return res.status(200).json({ message: "User added to channel", channelParticipant });
        } else if (action === "remove") {
            const channelParticipant = await prisma.channelParticipant.deleteMany({
                where: {
                    channelId,
                    participantId: userId,
                },
            });
            return res.status(200).json({ message: "User removed from channel!", channelParticipant });
        } else {
            return res.status(400).json({ message: "Invalid action, try again!" });
        }
    } catch (error) {
        console.log("Error in /channel/user", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// /channel/list -> Listing all users from that sub event
router.get("/list", async (req: Request, res: Response) => {
    try {
        const { channelId } = req.query;
        const participants = await prisma.channelParticipant.findMany({
            where: { channelId: Number(channelId) },
            include: {
                EventParticipant: {
                    include: {
                        User: true
                    }
                },
            },
        });
        const users = [];
        participants.map(participant => {
            users.push({ ...participant?.EventParticipant?.User, "role": participant?.EventParticipant?.role })
        });

        return res.status(200).json({ message: "Successfully fetched all the participants!", "participants": users });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;