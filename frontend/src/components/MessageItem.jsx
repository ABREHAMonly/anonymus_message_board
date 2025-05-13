import { useState } from "react";
import axios from "../utils/api";
import { FaThumbsUp, FaThumbsDown, FaHeart, FaReply } from "react-icons/fa";

const MessageItem = ({ message, onReplyAdded }) => {
    const [upvotes, setUpvotes] = useState(message.upvotes);
    const [downvotes, setDownvotes] = useState(message.downvotes);
    const [loves, setLoves] = useState(message.loves || 0);
    const [isHovered, setIsHovered] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [replies, setReplies] = useState(message.replies || []);

    const handleVote = async (type) => {
        try {
            await axios.patch(`/messages/${message._id}/vote`, { vote: type });
            if (type === "upvote") setUpvotes(upvotes + 1);
            if (type === "downvote") setDownvotes(downvotes + 1);
            if (type === "love") setLoves(loves + 1);
        } catch (err) {
            console.error("Voting failed", err);
        }
    };

    const handleReplyVote = async (replyId, type) => {
        try {
            await axios.patch(`/messages/${message._id}/replies/${replyId}/vote`, { vote: type });
            setReplies(replies.map(reply => {
                if (reply._id === replyId) {
                    return { 
                        ...reply, 
                        [type]: reply[type] + 1 
                    };
                }
                return reply;
            }));
        } catch (err) {
            console.error("Reply voting failed", err);
        }
    };

    const handleReplySubmit = async () => {
        try {
            if (!replyText.trim()) {
                console.error("Reply text is empty");
                return;
            }
    
            const response = await axios.post(
                `/messages/${message._id}/replies`, 
                { text: replyText },
                { headers: { 'Content-Type': 'application/json' } }
            );
            
            setReplies([...replies, response.data]);
            setReplyText("");
            if (onReplyAdded) onReplyAdded();
        } catch (err) {
            console.error("Failed to post reply:", err);
            if (err.response?.data?.error) {
                alert(`Error: ${err.response.data.error}`);
            } else {
                alert("Failed to post reply. Please try again.");
            }
        }
    };

    return (
        <div 
            style={{
                ...styles.container,
                ...(isHovered ? styles.containerHover : {})
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={styles.glowBar}></div>
            <p style={styles.messageText}>{message.text}</p>
            <div style={styles.infoContainer}>
                <span style={styles.category}>{message.category}</span>
                <span style={styles.user}>USER: {message.user || "ANONYMOUS"}</span>
            </div>
            <div style={styles.actions}>
                <button 
                    onClick={() => handleVote("upvote")} 
                    style={styles.upvote}
                    aria-label="Upvote"
                >
                    <FaThumbsUp style={styles.icon} /> 
                    <span style={styles.count}>{upvotes}</span>
                </button>
                <button 
                    onClick={() => handleVote("love")} 
                    style={styles.love}
                    aria-label="Love"
                >
                    <FaHeart style={styles.icon} /> 
                    <span style={styles.count}>{loves}</span>
                </button>
                <button 
                    onClick={() => handleVote("downvote")} 
                    style={styles.downvote}
                    aria-label="Downvote"
                >
                    <FaThumbsDown style={styles.icon} /> 
                    <span style={styles.count}>{downvotes}</span>
                </button>
                <button
                    onClick={() => setShowReplies(!showReplies)}
                    style={styles.replyButton}
                    aria-label="Toggle Replies"
                >
                    <FaReply style={styles.icon} />
                    <span style={styles.count}>{replies.length}</span>
                </button>
            </div>

            {showReplies && (
                <div style={styles.repliesSection}>
                    <div style={styles.replyForm}>
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            style={styles.replyInput}
                            placeholder="Write your reply..."
                            rows="2"
                        />
                        <div style={styles.replyFormActions}>
                            <button 
                                onClick={handleReplySubmit}
                                style={styles.replySubmitButton}
                                disabled={!replyText.trim()}
                            >
                                Post Reply
                            </button>
                            <button
                                onClick={() => setShowReplies(false)}
                                style={styles.cancelButton}
                            >
                                Close
                            </button>
                        </div>
                    </div>

                    {replies.length > 0 && (
                        <div style={styles.repliesContainer}>
                            {replies.map((reply) => (
                                <div key={reply._id} style={styles.replyItem}>
                                    <div style={styles.replyContent}>
                                        <span style={styles.replyUser}>{reply.user}</span>
                                        <p style={styles.replyText}>{reply.text}</p>
                                    </div>
                                    <div style={styles.replyActions}>
                                        <button 
                                            onClick={() => handleReplyVote(reply._id, "upvote")}
                                            style={styles.replyUpvote}
                                        >
                                            <FaThumbsUp size={12} /> {reply.upvotes}
                                        </button>
                                        <button
                                            onClick={() => handleReplyVote(reply._id, "love")}
                                            style={styles.replyLove}
                                        >
                                            <FaHeart size={12} /> {reply.loves}
                                        </button>
                                        <button
                                            onClick={() => handleReplyVote(reply._id, "downvote")}
                                            style={styles.replyDownvote}
                                        >
                                            <FaThumbsDown size={12} /> {reply.downvotes}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: "20px",
        backgroundColor: "rgba(30, 35, 50, 0.6)",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
        marginBottom: "15px",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
        border: "1px solid rgba(0, 170, 255, 0.1)",
    },
    containerHover: {
        transform: "translateY(-3px)",
        boxShadow: "0 10px 25px rgba(0, 170, 255, 0.2)",
        borderColor: "rgba(0, 170, 255, 0.3)",
    },
    glowBar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        background: "linear-gradient(90deg, transparent, #0af, transparent)",
        opacity: 0,
        transition: "opacity 0.3s ease",
    },
    messageText: {
        fontSize: "16px",
        color: "#e0e0e0",
        marginBottom: "15px",
        lineHeight: "1.5",
        letterSpacing: "0.5px",
    },
    infoContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "15px",
    },
    category: {
        backgroundColor: "rgba(0, 100, 200, 0.3)",
        color: "#0af",
        padding: "5px 10px",
        borderRadius: "4px",
        fontSize: "12px",
        letterSpacing: "1px",
    },
    user: {
        color: "#a0a0a0",
        fontSize: "12px",
        letterSpacing: "1px",
    },
    actions: {
        display: "flex",
        gap: "10px",
    },
    upvote: {
        background: "rgba(40, 167, 69, 0.2)",
        border: "1px solid rgba(40, 167, 69, 0.5)",
        color: "#28a745",
        padding: "8px 12px",
        borderRadius: "5px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "5px",
        transition: "all 0.3s ease",
    },
    love: {
        background: "rgba(220, 53, 69, 0.2)",
        border: "1px solid rgba(220, 53, 69, 0.5)",
        color: "#dc3545",
        padding: "8px 12px",
        borderRadius: "5px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "5px",
        transition: "all 0.3s ease",
    },
    downvote: {
        background: "rgba(108, 117, 125, 0.2)",
        border: "1px solid rgba(108, 117, 125, 0.5)",
        color: "#6c757d",
        padding: "8px 12px",
        borderRadius: "5px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "5px",
        transition: "all 0.3s ease",
    },
    replyButton: {
        background: "rgba(0, 170, 255, 0.1)",
        border: "1px solid rgba(0, 170, 255, 0.3)",
        color: "#0af",
        padding: "8px 12px",
        borderRadius: "5px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "5px",
        transition: "all 0.3s ease",
    },
    icon: {
        fontSize: "16px",
    },
    count: {
        fontSize: "14px",
    },
    replyForm: {
        marginTop: "15px",
        paddingTop: "15px",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    },
    replyInput: {
        width: "100%",
        padding: "10px",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        border: "1px solid rgba(0, 170, 255, 0.3)",
        borderRadius: "5px",
        color: "#fff",
        marginBottom: "10px",
    },
    replyFormActions: {
        display: "flex",
        gap: "10px",
        justifyContent: "flex-end",
    },
    replySubmitButton: {
        padding: "8px 16px",
        backgroundColor: "rgba(0, 170, 255, 0.3)",
        border: "1px solid #0af",
        color: "#0af",
        borderRadius: "5px",
        cursor: "pointer",
    },
    cancelButton: {
        padding: "8px 16px",
        backgroundColor: "rgba(255, 50, 50, 0.2)",
        border: "1px solid rgba(255, 50, 50, 0.5)",
        color: "#ff3232",
        borderRadius: "5px",
        cursor: "pointer",
    },
    repliesSection: {
        marginTop: "15px",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        paddingTop: "15px"
    },
    repliesContainer: {
        marginTop: "10px",
        paddingLeft: "20px",
        borderLeft: "2px solid rgba(0, 170, 255, 0.2)",
    },
    replyItem: {
        margin: "10px 0",
        padding: "10px",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        borderRadius: "5px",
    },
    replyContent: {
        marginBottom: "8px",
    },
    replyUser: {
        fontSize: "12px",
        color: "#0af",
        marginBottom: "4px",
    },
    replyText: {
        fontSize: "14px",
        color: "#ccc",
    },
    replyActions: {
        display: "flex",
        gap: "8px",
    },
    replyUpvote: {
        background: "rgba(40, 167, 69, 0.1)",
        border: "1px solid rgba(40, 167, 69, 0.3)",
        color: "#28a745",
        padding: "4px 8px",
        borderRadius: "3px",
        display: "flex",
        alignItems: "center",
        gap: "4px",
    },
    replyLove: {
        background: "rgba(220, 53, 69, 0.1)",
        border: "1px solid rgba(220, 53, 69, 0.3)",
        color: "#dc3545",
        padding: "4px 8px",
        borderRadius: "3px",
        display: "flex",
        alignItems: "center",
        gap: "4px",
    },
    replyDownvote: {
        background: "rgba(108, 117, 125, 0.1)",
        border: "1px solid rgba(108, 117, 125, 0.3)",
        color: "#6c757d",
        padding: "4px 8px",
        borderRadius: "3px",
        display: "flex",
        alignItems: "center",
        gap: "4px",
    },
    "@media (hover: hover)": {
        container: {
            "&:hover $glowBar": {
                opacity: 1,
            },
        },
        upvote: {
            "&:hover": {
                background: "rgba(40, 167, 69, 0.4)",
                boxShadow: "0 0 10px rgba(40, 167, 69, 0.3)",
            },
        },
        love: {
            "&:hover": {
                background: "rgba(220, 53, 69, 0.4)",
                boxShadow: "0 0 10px rgba(220, 53, 69, 0.3)",
            },
        },
        downvote: {
            "&:hover": {
                background: "rgba(108, 117, 125, 0.4)",
                boxShadow: "0 0 10px rgba(108, 117, 125, 0.3)",
            },
        },
        replyButton: {
            "&:hover": {
                background: "rgba(0, 170, 255, 0.2)",
                boxShadow: "0 0 8px rgba(0, 170, 255, 0.2)",
            },
        },
    },
    "@media (max-width: 768px)": {
        container: {
            padding: "15px",
        },
        messageText: {
            fontSize: "15px",
        },
    },
    "@media (max-width: 480px)": {
        container: {
            padding: "12px",
        },
        actions: {
            gap: "8px",
        },
        upvote: {
            padding: "6px 10px",
        },
        love: {
            padding: "6px 10px",
        },
        downvote: {
            padding: "6px 10px",
        },
        replyButton: {
            padding: "6px 10px",
        },
    },
};

export default MessageItem;