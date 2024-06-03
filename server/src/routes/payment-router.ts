import { Router, Request, Response } from "express";
import prisma from "../db/db";

const router = Router();

// To update budget's spent amount
const updateBudgetSpent = async (eventId) => {
    const payments = await prisma.payment.findMany({
        where: { eventId },
    });
    const spent = payments.reduce((acc, payment) => acc + payment.amount, 0);
    await prisma.budget.update({
        where: { eventId },
        data: { spent },
    });
};

// /payment/create -> Route for creating a new payment in a event
router.route("/create")
    .post(async (req: Request, res: Response) => {
        const { amount, date, payerId, payeeId, status, eventId } = req.body;
        try {
            const payment = await prisma.payment.create({
                data: {
                    amount,
                    date,
                    payerId,
                    payeeId,
                    eventId: parseInt(eventId),
                    status,
                },
            });
            await updateBudgetSpent(parseInt(eventId));
            res.status(201).json({ message: "Created the payment record!", payment });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    })

// /payment -> Route for CRUD operation related to payment in a event
router.route("/")
    .post(async (req: Request, res: Response) => {
        const { eventId } = req.body;
        try {
            const payments = await prisma.payment.findMany({
                where: { eventId: parseInt(eventId) },
                include: {
                    Payer: {
                        select: { name: true }
                    },
                    Payee: {
                        select: { name: true }
                    }
                }
            });

            res.status(200).json({ message: "Fetched all payment for the event", payments });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    })
    .put(async (req: Request, res: Response) => {
        const { amount, payerId, payeeId, status, eventId, id } = req.body;
        try {
            const existingPayment = await prisma.payment.findUnique({
                where: { id: parseInt(id) },
            });
            if (!existingPayment || existingPayment.eventId !== parseInt(eventId)) {
                return res.status(404).json({ error: 'Payment not found' });
            }

            const payment = await prisma.payment.update({
                where: { id: parseInt(id) },
                data: { amount, payerId, payeeId, status },
            });
            await updateBudgetSpent(parseInt(eventId));
            res.status(200).json({ message: "Updated the payment record!", payment });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    })
    .delete(async (req: Request, res: Response) => {
        const { eventId, paymentId } = req.body;
        try {
            const payment = await prisma.payment.findUnique({
                where: { id: parseInt(paymentId) },
            });
            if (!payment || payment.eventId !== parseInt(eventId)) {
                return res.status(404).json({ error: 'Payment not found or not from this event!' });
            }

            await prisma.payment.delete({
                where: { id: parseInt(paymentId) },
            });
            await updateBudgetSpent(parseInt(eventId));
            res.status(204).json({ message: "Payment record deleted!" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }

    })


export default router;