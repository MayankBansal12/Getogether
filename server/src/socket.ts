import { Server } from "socket.io";
import prisma from "./db/db";
import { JoinChannelPayload, SendMessagePayload, PersonalMessagePayLoad } from "./types/types";

export default function (io: Server) {
    io.on("connection", (socket) => {
        console.log("User connected socket");

        // For personal messages
        // For connecting the dm with a user
        socket.on("join-dm", ({ roomId }) => {
            console.log("connected in room: ", roomId);
            socket.join(roomId);
        })

        // Leave dm
        socket.on("leave-dm", ({ roomId }) => {
            console.log("disconnected in room: ", roomId);
            socket.leave(roomId);
        });

        // For sending message
        socket.on("personal-message", async ({ eventId, senderId, receiverId, message, photoLink, roomId }: PersonalMessagePayLoad) => {
            console.log("Message: ", roomId);
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

            // emit message to the room
            io.to(roomId).emit('newDirectMessage', newMessage);
        })

        // For group messages
        // Join group with a unique groupId
        socket.on("join-group", async ({ userId, groupId }: JoinChannelPayload) => {
            console.log("User with userId ", userId, " connected in group: ", groupId);
            socket.join(groupId.toString());
        })

        // Leave group room
        socket.on("leave-group", ({ userId, groupId }) => {
            console.log("User with userId ", userId, " left group: ", groupId);
            socket.leave(groupId.toString());
        });

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