// Router for groups -> /group

import { Router, Request, Response } from "express";
import prisma from "../db/db";
const router = Router();


// /group/message/list -> listing all messages from that group
router.post("/message/list", async (req: Request, res: Response) => {
    try {
        const { groupId, eventId } = req.body;
        const message = await prisma.group.findUnique({
            where: { id: groupId, eventId },
            include: {
                GroupMessage: {
                    include: {
                        SenderChannelParticipant: {
                            include: {
                                EventParticipant: {
                                    include: {
                                        User: true
                                    }
                                }
                            }
                        }
                    }
                },
            },
        });
        if (!message) {
            return res.status(404).json({ message: "Messages not found for group: ", groupId });
        }
        return res.status(200).json({ message: "Successfully fetched the group details!", messages: message.GroupMessage });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});


// /group -> For fetching, editing, deleting group details with that id
router.route("/")
    .post(async (req: Request, res: Response) => {
        try {
            const { groupId, eventId } = req.body;
            const group = await prisma.group.findUnique({
                where: { id: groupId, eventId },
                include: {
                    GroupRelation: true,
                },
            });
            if (!group) {
                return res.status(404).json({ message: "Group not found!" });
            }
            return res.status(200).json({ message: "Successfully fetched the group details!", group: group });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    })
    .put(async (req: Request, res: Response) => {
        try {
            const { groupId, eventId, name, desc } = req.body;
            const group = await prisma.group.update({
                where: { id: groupId, eventId },
                data: { name, desc },
            });
            return res.status(201).json({ message: "Successfully changed the group details!", group: group });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    })
    .delete(async (req: Request, res: Response) => {
        try {
            const { groupId, eventId } = req.body;
            await prisma.group.delete({
                where: { id: groupId, eventId },
            });

            return res.status(200).json({ message: "Group deleted successfully!" });
        } catch (error) {
            return res.status(500).json({ error: "Internal server error!" });
        }
    });


export default router;