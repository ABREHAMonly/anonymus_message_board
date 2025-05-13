// components/MessageList.js
import { useEffect, useState } from "react";
import axios from "../utils/api";
import MessageItem from "./MessageItem";

const MessageList = ({ selectedCategory }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        // Create floating particles
        const newParticles = Array.from({ length: 15 }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            speed: Math.random() * 0.2 + 0.1,
            color: `hsl(${Math.random() * 60 + 200}, 80%, 60%)`,
            delay: Math.random() * 5
        }));
        setParticles(newParticles);

        const fetchMessages = async () => {
            try {
                const url = selectedCategory 
                    ? `/messages?category=${selectedCategory}`
                    : '/messages';
                const response = await axios.get(url);
                setMessages(response.data);
            } catch (err) {
                console.error("Error fetching messages", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [selectedCategory]);

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.particleContainer}>
                    {particles.map((particle, i) => (
                        <div 
                            key={i}
                            style={{
                                ...styles.particle,
                                left: `${particle.x}%`,
                                top: `${particle.y}%`,
                                width: `${particle.size}px`,
                                height: `${particle.size}px`,
                                backgroundColor: particle.color,
                                animation: `float ${5/particle.speed}s ${particle.delay}s infinite ease-in-out`,
                            }}
                        />
                    ))}
                </div>
                {[...Array(5)].map((_, index) => (
                    <div key={index} style={styles.skeleton}>
                        <div style={styles.skeletonLine}></div>
                        <div style={styles.skeletonLineShort}></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.particleContainer}>
                {particles.map((particle, i) => (
                    <div 
                        key={i}
                        style={{
                            ...styles.particle,
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            backgroundColor: particle.color,
                            animation: `float ${5/particle.speed}s ${particle.delay}s infinite ease-in-out`,
                        }}
                    />
                ))}
            </div>
            
            {messages.length > 0 ? (
                messages.map((msg) => <MessageItem key={msg._id} message={msg} />)
            ) : (
                <div style={styles.noMessages}>
                    <div style={styles.noMessagesIcon}>📭</div>
                    <p>NO MESSAGES FOUND IN DATABASE</p>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        marginTop: "20px",
        padding: "25px",
        backgroundColor: "rgba(20, 25, 40, 0.8)",
        borderRadius: "15px",
        boxShadow: "0 10px 30px rgba(0, 170, 255, 0.1)",
        border: "1px solid rgba(0, 170, 255, 0.1)",
        position: "relative",
        overflow: "hidden",
        minHeight: "300px",
    },
    particleContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        overflow: "hidden",
    },
    particle: {
        position: "absolute",
        borderRadius: "50%",
        opacity: 0.7,
        filter: "blur(1px)",
    },
    skeleton: {
        backgroundColor: "rgba(30, 35, 50, 0.5)",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "15px",
    },
    skeletonLine: {
        height: "18px",
        backgroundColor: "rgba(50, 55, 70, 0.5)",
        borderRadius: "4px",
        marginBottom: "10px",
        animation: "pulse 1.5s infinite ease-in-out",
    },
    skeletonLineShort: {
        height: "18px",
        width: "60%",
        backgroundColor: "rgba(50, 55, 70, 0.5)",
        borderRadius: "4px",
        animation: "pulse 1.5s infinite ease-in-out",
    },
    noMessages: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        color: "#a0a0a0",
        fontSize: "18px",
        letterSpacing: "1px",
    },
    noMessagesIcon: {
        fontSize: "50px",
        marginBottom: "20px",
        opacity: 0.5,
    },
    "@keyframes pulse": {
        "0%, 100%": {
            opacity: 0.6,
        },
        "50%": {
            opacity: 1,
        },
    },
    "@keyframes float": {
        "0%, 100%": {
            transform: "translateY(0)",
        },
        "50%": {
            transform: "translateY(-20px)",
        },
    },
    // Responsive styles
    "@media (max-width: 768px)": {
        container: {
            padding: "15px",
            borderRadius: "10px",
        },
    },
    "@media (max-width: 480px)": {
        container: {
            padding: "10px",
        },
        noMessages: {
            fontSize: "16px",
        },
    },
};

export default MessageList;