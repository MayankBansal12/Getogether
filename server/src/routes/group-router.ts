// Router for groups -> /group

import { Router, Request, Response } from "express";
import prisma from "../db/db";
const router = Router();

// /group/:groupId -> For fetching, editing, deleting group details with that id
router.route("/:groupId")
    .get(async (req: Request, res: Response) => {
        try {
            const { groupId } = req.params;
            const group = await prisma.group.findUnique({
                where: { id: Number(groupId) },
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
            const { groupId } = req.params;
            const { name, desc } = req.body;
            const group = await prisma.group.update({
                where: { id: Number(groupId) },
                data: { name, desc },
            });
            return res.status(201).json({ message: "Successfully changed the group details!", group: group });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    })
    .delete(async (req: Request, res: Response) => {
        try {
            const { groupId } = req.params;
            await prisma.group.delete({
                where: { id: Number(groupId) },
            });
            res.status(204).json({ message: "Group deleted successfully!" });
        } catch (error) {
            res.status(500).json({ error: "Internal server error!" });
        }
    });

// /group/message/list -> listing all messages from that group
router.get("/:groupId/message/list", async (req: Request, res: Response) => {
    try {
        const { groupId } = req.params;
        const message = await prisma.group.findUnique({
            where: { id: Number(groupId) },
            include: {
                GroupMessage: true,
            },
        });
        if (!message) {
            return res.status(404).json({ message: "Messages not found for group: ", groupId });
        }
        return res.status(200).json({ message: "Successfully fetched the group details!", messages: message });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// /group/message/send -> sending a new message in that group
router.post("/message/send", (req: Request, res: Response) => {

})

export default router;