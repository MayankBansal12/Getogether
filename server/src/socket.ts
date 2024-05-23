import { Server } from "socket.io";
import prisma from "./db/db";
import { JoinChannelPayload, SendMessagePayload, PersonalMessagePayLoad } from "./types/types";

export default function (io: Server) {
    io.on("connection", (socket) => {
        console.log("User connected!");

        // For personal messages
        // For connecting the dm with a user
        socket.on("join-dm", ({ eventId, userId }) => {
            const roomId = `${eventId}_${userId}`;
            socket.join(roomId);
        })

        socket.on("personal-message", async ({ eventId, senderId, receiverId, message, photoLink }: PersonalMessagePayLoad) => {
            const newMessage = await prisma.chat.create({
                data: {
                    eventId,
                    senderId,
                    receiverId,
                    message,
                    photos: photoLink,
                    time: new Date(),
                },
            });

            const senderRoomId = `${eventId}_${senderId}`;
            const receiverRoomId = `${eventId}_${receiverId}`;

            // Emit message to the sender and receiver
            io.to(senderRoomId).emit('newDirectMessage', newMessage);
            io.to(receiverRoomId).emit('newDirectMessage', newMessage);
        })

        // For group messages
        // Join group with a unique groupId
        socket.on("join-group", async ({ userId, groupId }: JoinChannelPayload) => {
            console.log("User with userId ", userId, " connected in group: ", groupId);
            socket.join(groupId.toString());
        })

        // Send messages in a group
        socket.on("send-message", async ({ userId, groupId, message, photoLink }: SendMessagePayload) => {
            const newMessage = await prisma.groupMessage.create({
                data: {
                    senderId: userId,
                    groupId,
                    message,
                    photos: photoLink
                }
            })
            io.to(groupId.toString()).emit("message", newMessage);
        })

        socket.on("disconnect", () => {
            console.log("User disconnected!");
        })
    })
}