import { useState } from "react";
import axios from "../utils/api";
import { FaThumbsUp, FaThumbsDown, FaHeart } from "react-icons/fa";

const UpvoteDownvote = ({ messageId, initialUpvotes, initialDownvotes, initialLoves = 0 }) => {
    const [upvotes, setUpvotes] = useState(initialUpvotes);
    const [downvotes, setDownvotes] = useState(initialDownvotes);
    const [loves, setLoves] = useState(initialLoves);

    const handleVote = async (type) => {
        try {
            await axios.patch(`/messages/${messageId}/vote`, { vote: type });
            if (type === "upvote") setUpvotes(upvotes + 1);
            if (type === "downvote") setDownvotes(downvotes + 1);
            if (type === "love") setLoves(loves + 1);
        } catch (err) {
            console.error("Voting failed", err);
        }
    };

    return (
        <div style={styles.container}>
            <div 
                style={styles.voteButton}
                onClick={() => handleVote("upvote")}
                className="vote-button-hover"
                aria-label="Upvote"
            >
                <FaThumbsUp style={styles.upvoteIcon} />
                <span style={styles.voteCount}>{upvotes}</span>
            </div>
            
            <div 
                style={styles.voteButton}
                onClick={() => handleVote("love")}
                className="vote-button-hover"
                aria-label="Love"
            >
                <FaHeart style={styles.loveIcon} />
                <span style={styles.voteCount}>{loves}</span>
            </div>
            
            <div 
                style={styles.voteButton}
                onClick={() => handleVote("downvote")}
                className="vote-button-hover"
                aria-label="Downvote"
            >
                <FaThumbsDown style={styles.downvoteIcon} />
                <span style={styles.voteCount}>{downvotes}</span>
            </div>

            <style jsx>{`
                .vote-button-hover:hover {
                    transform: scale(1.1);
                }
                .vote-button-hover:hover svg {
                    filter: drop-shadow(0 0 5px currentColor);
                }
            `}</style>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        gap: "15px",
        alignItems: "center",
    },
    voteButton: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        transition: "all 0.3s ease",
        padding: "8px",
        borderRadius: "8px",
        background: "rgba(30, 35, 50, 0.5)",
        minWidth: "50px",
    },
    upvoteIcon: {
        color: "#28a745",
        fontSize: "20px",
        marginBottom: "5px",
        transition: "all 0.3s ease",
    },
    loveIcon: {
        color: "#dc3545",
        fontSize: "20px",
        marginBottom: "5px",
        transition: "all 0.3s ease",
    },
    downvoteIcon: {
        color: "#6c757d",
        fontSize: "20px",
        marginBottom: "5px",
        transition: "all 0.3s ease",
    },
    voteCount: {
        color: "#e0e0e0",
        fontSize: "14px",
        fontWeight: "bold",
    },

    // Responsive styles
    "@media (max-width: 768px)": {
        container: {
            gap: "10px",
        },
        voteButton: {
            minWidth: "40px",
            padding: "6px",
        },
        upvoteIcon: {
            fontSize: "18px",
        },
        loveIcon: {
            fontSize: "18px",
        },
        downvoteIcon: {
            fontSize: "18px",
        },
        voteCount: {
            fontSize: "12px",
        },
    },
};

export default UpvoteDownvote;