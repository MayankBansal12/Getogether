import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

const BACKEND_URL = 'http://localhost:5000'

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(BACKEND_URL);
        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket} >
            {children}
        </SocketContext.Provider>
    );
};