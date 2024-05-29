import React, { useEffect } from 'react'
import axios from 'axios';

const backend = import.meta.env.VITE_SERVER;

const useApi = async (endpoint: string, method = 'GET', data = null) => {

    const token = localStorage.getItem("token");
    if (!token) {
        (window as any).location = "/auth/login";
    }
    try {
        const config = {
            method: method,
            url: backend + endpoint,
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
            data: data,
        };

        const result = await axios(config);

        return result;
    } catch (error) {
        if (error.response.data.token === false) {
            (window as any).location = "/auth/login";
        }
        if (error.response.data.valid === false) {
            localStorage.removeItem("token");
            (window as any).location = "/auth/login";
        }
        console.log("Error while calling api: ", error);
        return error.response;
    }
};

export default useApi