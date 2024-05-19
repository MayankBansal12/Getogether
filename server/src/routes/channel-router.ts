// Router for channel(sub event) -> /channel
import { Router, Request, Response } from "express";
import prisma from "../db/db";
const router = Router();

// /channel/:channelId -> For creating/editing that sub event 
router.route("/:channelId")
    .get(async (req: Request, res: Response) => {
        try {
            const { channelId } = req.params;
            const channel = await prisma.channel.findUnique({
                where: { id: Number(channelId) },
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
            const { channelId } = req.params;
            const { name, venue, startTime, endTime } = req.body;
            const channel = await prisma.channel.update({
                where: { id: Number(channelId) },
                data: { name, venue, startTime, endTime },
            });
            return res.status(201).json({ message: "Successfully changed the group details!", channel });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    })
    .delete(async (req: Request, res: Response) => {
        try {
            const { channelId } = req.params;
            await prisma.channel.delete({
                where: { id: Number(channelId) },
            });
            res.status(204).json({ message: "Channel deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    });

// /channel/group/create -> Creating a new group inside a sub event
router.post("/group/create", async (req: Request, res: Response) => {
    try {
        const { eventId, name, desc } = req.body;
        const group = await prisma.group.create({
            data: {
                name,
                desc,
                eventId,
            },
        });
        res.json(group);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// /channel/user -> Adding /removing a user from sub event
router.post("/channel/user", async (req: Request, res: Response) => {
    try {
        const { channelId, userId, action } = req.body;

        if (action === "add") {
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
            return res.status(200).json({ message: "User removed from channel", channelParticipant });
        } else {
            return res.status(400).json({ message: "Invalid action, try again!" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// /channel/list -> Listing all users from that sub event
router.get("/channel/list", async (req: Request, res: Response) => {
    try {
        const { channelId } = req.query;
        const participants = await prisma.channelParticipant.findMany({
            where: { channelId: Number(channelId) },
            include: {
                EventParticipant: true,
            },
        });
        return res.status(200).json({ message: "Successfully fetched all the participants!", participants });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;