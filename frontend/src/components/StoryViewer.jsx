import { useEffect, useState } from "react";
import axios from "../utils/api";
import { FaHeart, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Modal from "react-modal";

const StoryViewer = ({ onNewStoryUpload }) => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentStory, setCurrentStory] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await axios.get("/stories/all");
                setStories(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching stories", err);
                setLoading(false);
            }
        };

        fetchStories();
    }, []);

    useEffect(() => {
        if (onNewStoryUpload) {
            setStories(prev => [onNewStoryUpload, ...prev]);
        }
    }, [onNewStoryUpload]);

    const handleReaction = async (storyId, reactionType) => {
        try {
            await axios.post("/stories/reaction", { storyId, reactionType });
            setStories(prev => prev.map(story => 
                story._id === storyId ? {
                    ...story,
                    reactions: { ...story.reactions, [reactionType]: story.reactions[reactionType] + 1 }
                } : story
            ));
        } catch (err) {
            alert("Error adding reaction");
        }
    };

    const openStory = (index) => {
        setCurrentIndex(index);
        setCurrentStory(stories[index]);
        setModalIsOpen(true);
        startProgress();
    };

    const closeStory = () => {
        setModalIsOpen(false);
        setCurrentStory(null);
        setProgress(0);
    };

    const startProgress = () => {
        setProgress(0);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    nextStory();
                    return 0;
                }
                return prev + 1;
            });
        }, 50);
    };

    const nextStory = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setCurrentStory(stories[currentIndex + 1]);
            setProgress(0);
        } else {
            closeStory();
        }
    };

    const prevStory = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setCurrentStory(stories[currentIndex - 1]);
            setProgress(0);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.storiesWrapper}>
                <div style={styles.storiesContainer}>
                    {loading ? (
                        <div style={styles.loadingStories}>
                            {[...Array(6)].map((_, i) => (
                                <div key={i} style={styles.skeletonStory}>
                                    <div style={styles.skeletonShimmer} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={styles.storiesList}>
                            {stories.map((story, index) => (
                                <div 
                                    key={story._id} 
                                    style={styles.storyCircle}
                                    onClick={() => openStory(index)}
                                >
                                    <div style={styles.storyBorder}>
                                        <img
                                            src={`http://localhost:5000${story.imageUrl}`}
                                            alt="Story"
                                            style={styles.storyImage}
                                        />
                                    </div>
                                    <p style={styles.username}>{story.user?.name || "Anonymous"}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeStory}
                style={styles.modal}
                ariaHideApp={false}
            >
                {currentStory && (
                    <div style={styles.modalContent}>
                        <div style={styles.progressBarContainer}>
                            {stories.map((_, index) => (
                                <div 
                                    key={index} 
                                    style={styles.progressBarBackground}
                                >
                                    <div 
                                        style={{
                                            ...styles.progressBar,
                                            width: `${index === currentIndex ? progress : 
                                                index < currentIndex ? 100 : 0}%`,
                                            background: `linear-gradient(90deg, #0af ${progress}%, rgba(0,170,255,0.3) 100%)`
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        <div style={styles.mediaContainer}>
                            <button 
                                style={styles.navButtonLeft} 
                                onClick={prevStory}
                                disabled={currentIndex === 0}
                            >
                                <FaChevronLeft style={styles.navIcon} />
                            </button>
                            
                            <img
                                src={`http://localhost:5000${currentStory.imageUrl}`}
                                alt="Story"
                                style={styles.modalImage}
                            />
                            
                            <button 
                                style={styles.navButtonRight} 
                                onClick={nextStory}
                                disabled={currentIndex === stories.length - 1}
                            >
                                <FaChevronRight style={styles.navIcon} />
                            </button>
                        </div>

                        <div style={styles.modalFooter}>
                            <div 
                                style={styles.reactionButton}
                                onClick={() => handleReaction(currentStory._id, "love")}
                            >
                                <FaHeart style={styles.heartIcon} />
                                <span style={styles.reactionCount}>{currentStory.reactions.love}</span>
                            </div>
                            
                            <button 
                                style={styles.closeButton} 
                                onClick={closeStory}
                            >
                                <FaTimes style={styles.closeIcon} />
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

const styles = {
    container: {
        width: "100%",
        padding: "2rem 0",
        background: "linear-gradient(45deg, #0a0a1a, #1a1a2e)",
        position: "relative",
    },
    storiesWrapper: {
        maxWidth: "100%",
        overflowX: "auto",
        padding: "0 1rem",
        "&::-webkit-scrollbar": {
            height: "4px",
        },
        "&::-webkit-scrollbar-thumb": {
            background: "#0af",
            borderRadius: "4px",
        },
    },
    storiesContainer: {
        maxWidth: "1400px",
        margin: "0 auto",
    },
    loadingStories: {
        display: "flex",
        gap: "1.5rem",
        padding: "1rem 0",
    },
    skeletonStory: {
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.1)",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
    },
    skeletonShimmer: {
        position: "absolute",
        top: 0,
        left: "-100%",
        width: "200%",
        height: "100%",
        background: "linear-gradient(90deg, transparent, rgba(0,170,255,0.2), transparent)",
        animation: "shimmer 1.5s infinite",
    },
    storiesList: {
        display: "flex",
        gap: "1.5rem",
        padding: "1rem 0",
    },
    storyCircle: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
        cursor: "pointer",
        flexShrink: 0,
        transition: "transform 0.3s ease",
        "&:hover": {
            transform: "translateY(-5px)",
        },
    },
    storyBorder: {
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        padding: "2px",
        background: "linear-gradient(45deg, #0af, #00ff88)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 0 15px rgba(0,170,255,0.3)",
        transition: "all 0.3s ease",
        "&:hover": {
            boxShadow: "0 0 25px rgba(0,170,255,0.5)",
        },
    },
    storyImage: {
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        objectFit: "cover",
        border: "2px solid #0a0a1a",
    },
    username: {
        color: "#e0e0e0",
        fontSize: "0.9rem",
        maxWidth: "100px",
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textAlign: "center",
        textShadow: "0 0 5px rgba(0,170,255,0.3)",
    },
    modal: {
        overlay: { 
            backgroundColor: "rgba(0, 0, 0, 0.9)", 
            zIndex: 1000,
            backdropFilter: "blur(10px)",
        },
        content: { 
            padding: 0,
            border: "none",
            background: "none",
            inset: 0,
        },
    },
    modalContent: {
        position: "relative",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "rgba(10, 15, 30, 0.95)",
    },
    progressBarContainer: {
        display: "flex",
        gap: "4px",
        padding: "1rem",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    progressBarBackground: {
        flex: 1,
        height: "3px",
        background: "rgba(255,255,255,0.1)",
        borderRadius: "2px",
        overflow: "hidden",
    },
    progressBar: {
        height: "100%",
        transition: "width 0.1s linear",
        boxShadow: "0 0 5px #0af",
    },
    mediaContainer: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
    },
    modalImage: {
        width: "50%",
        height: "77%",
        left: "26%",
        objectFit: "cover",
        position: "absolute",
        filter: "drop-shadow(0 0 20px rgba(0,170,255,0.2))",
    },
    navButtonLeft: {
        position: "absolute",
        left: "1rem",
        background: "rgba(0,0,0,0.3)",
        border: "1px solid rgba(0,170,255,0.5)",
        borderRadius: "50%",
        color: "#0af",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: 2,
        transition: "all 0.3s ease",
        "&:hover": {
            background: "rgba(0,170,255,0.2)",
            boxShadow: "0 0 10px #0af",
        },
    },
    navButtonRight: {
        position: "absolute",
        right: "1rem",
        background: "rgba(0,0,0,0.3)",
        border: "1px solid rgba(0,170,255,0.5)",
        borderRadius: "50%",
        color: "#0af",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: 2,
        transition: "all 0.3s ease",
        "&:hover": {
            background: "rgba(0,170,255,0.2)",
            boxShadow: "0 0 10px #0af",
        },
    },
    navIcon: {
        fontSize: "1.5rem",
        filter: "drop-shadow(0 0 2px #0af)",
    },
    modalFooter: {
        position: "absolute",
        bottom: "2rem",
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 2rem",
    },
    reactionButton: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        background: "rgba(0,0,0,0.3)",
        border: "1px solid rgba(0,170,255,0.5)",
        padding: "0.5rem 1rem",
        borderRadius: "2rem",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
            background: "rgba(0,170,255,0.2)",
            boxShadow: "0 0 10px #0af",
        },
    },
    heartIcon: {
        color: "#ff6b6b",
        fontSize: "1.5rem",
        filter: "drop-shadow(0 0 5px #ff6b6b)",
    },
    reactionCount: {
        color: "#fff",
        fontSize: "1rem",
        fontWeight: "bold",
        textShadow: "0 0 5px rgba(0,170,255,0.5)",
    },
    closeButton: {
        background: "rgba(0,0,0,0.3)",
        border: "1px solid rgba(0,170,255,0.5)",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
            background: "rgba(255,50,50,0.2)",
            borderColor: "#f55",
            boxShadow: "0 0 10px #f55",
        },
    },
    closeIcon: {
        color: "#f55",
        fontSize: "1.5rem",
    },
    "@keyframes shimmer": {
        "0%": { transform: "translateX(-100%)" },
        "100%": { transform: "translateX(100%)" },
    },
    "@media (max-width: 768px)": {
        storyBorder: {
            width: "60px",
            height: "60px",
        },
        username: {
            fontSize: "0.8rem",
        },
        navButtonLeft: {
            left: "0.5rem",
            width: "35px",
            height: "35px",
        },
        navButtonRight: {
            right: "0.5rem",
            width: "35px",
            height: "35px",
        },
        navIcon: {
            fontSize: "1.2rem",
        },
    },
    "@media (max-width: 480px)": {
        storyBorder: {
            width: "50px",
            height: "50px",
        },
        storiesList: {
            gap: "1rem",
        },
    },
};

export default StoryViewer;