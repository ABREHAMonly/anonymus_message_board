import React, { createContext, useState, useEffect } from "react";
import axios from "../utils/api";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get("/messages");
                setMessages(response.data);
            } catch (err) {
                console.error("Error fetching messages", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    const addMessage = (newMessage) => {
        setMessages((prevMessages) => [newMessage, ...prevMessages]);
    };

    const updateMessageVotes = (id, type) => {
        setMessages((prevMessages) =>
            prevMessages.map((message) =>
                message._id === id
                    ? {
                          ...message,
                          [type]: message[type] + 1,
                          transition: "all 0.3s ease-in-out",
                      }
                    : message
            )
        );
    };

    return (
        <MessageContext.Provider
            value={{
                messages,
                loading,
                addMessage,
                updateMessageVotes,
            }}
        >
            {children}
        </MessageContext.Provider>
    );
};

export default MessageContext;