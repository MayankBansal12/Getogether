// Router for table -> /table
import { Router, Request, Response } from "express";
import prisma from "../db/db";
const router = Router();

// /table/setup -> Route to create or update the EventTable for an event
router.post('/setup', async (req: Request, res: Response) => {
    const { eventId, totalRow, totalCol, tableSize } = req.body;

    try {
        const eventTable = await prisma.eventTable.upsert({
            where: { eventId },
            update: {
                total_row: totalRow,
                total_col: totalCol,
                table_size: tableSize,
            },
            create: {
                eventId,
                total_row: totalRow,
                total_col: totalCol,
                table_size: tableSize,
            },
        });
        res.status(201).json({ message: "Table setup completed!", table: eventTable });
    } catch (error) {
        res.status(500).json({ message: "Error setting up the table!", error: error.message });
    }
});

// /table/event -> Route to show all tables of an event and by whom they have been booked
router.post('/event', async (req, res) => {
    const { eventId } = req.body;

    try {
        const tables = await prisma.eventTable.findUnique({
            where: {
                eventId
            },
            include: {
                SingleTable: {
                    include: {
                        User: true,
                    },
                },
            },
        });

        if (!tables) {
            return res.status(404).json({ message: "Event not found or no tables assigned!" });
        }

        res.status(200).json({ message: "Fetched all tables for the event!", tables });
    } catch (error) {
        res.status(500).json({ message: "Error fetching tables for the event!", error: error.message });
    }
});

// /table/user -> Route to show all tables booked by a specific user
router.post('/user', async (req, res) => {
    const { userId, eventId } = req.body;

    try {
        const tables = await prisma.singleTable.findMany({
            where: {
                userId,
                EventTable: {
                    eventId
                }
            },
            include: {
                EventTable: {
                    include: {
                        Event: true,
                    },
                },
            },
        });

        res.status(200).json({ message: "Fetched tables for this user!", tables });
    } catch (error) {
        res.status(500).json({ message: "Error fetching tables for the user!", error: error.message });
    }
});


// /table/status -> Route to change booking status for a event
router.put('/status', async (req: Request, res: Response) => {
    const { status, eventId } = req.body;
    // status will be boolean: true for book table available

    try {
        await prisma.event.update({
            where: { id: eventId },
            data: {
                bookTable: status
            }
        })
        res.status(201).json({ message: "Updated the status for table in event", bookTable: status })
    } catch (error) {
        res.status(500).json({ message: "Error chaning the booking status", error: error.message });
    }
})

// /table/assign -> Route to assign/cancel a user to a single table
router.route('/assign')
    .post(async (req: Request, res: Response) => {
        const { eventId, tableId, userId, row, col } = req.body;

        try {
            // Get the EventTable for the given eventId
            const eventTable = await prisma.eventTable.findUnique({
                where: { eventId },
            });

            if (!eventTable) {
                return res.status(400).json({ message: "Invalid request for event!" });
            }

            const existingAssignment = await prisma.singleTable.findFirst({
                where: {
                    row,
                    col,
                },
            });
            if (existingAssignment) {
                return res.status(400).json({ message: "Table is already assigned to a user!" });
            }

            const singleTable = await prisma.singleTable.create({
                data: {
                    tableId: eventTable.id,
                    userId,
                    row,
                    col,
                },
            });
            res.status(201).json({ message: "Table assigned to the user!", table: singleTable });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Error assigning the table!", error: error.message });
        }
    })
    .delete(async (req, res) => {
        const { userId, row, col } = req.body;

        try {
            const assignment = await prisma.singleTable.findMany({
                where: {
                    row, col
                },
            });

            if (!assignment) {
                return res.status(404).json({ message: "Table assignment not found!" });
            }

            await prisma.singleTable.deleteMany({
                where: {
                    row, col, userId
                },
            });

            res.status(200).json({ message: "Table assignment cancelled!" });
        } catch (error) {
            res.status(500).json({ message: "Error cancelling the table assignment!", error: error.message });
        }
    });

export default router;