import { useState, useEffect } from "react";
import MessageForm from "../components/MessageForm";
import MessageList from "../components/MessageList";
import CategoryFilter from "../components/CategoryFilter";
import StoryUploader from "../components/StoryUploader";
import StoryViewer from "../components/StoryViewer";

const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
    const [stories, setStories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => setIsLoading(false), 1500);
        
        // Create background particles
        const newParticles = Array.from({ length: 30 }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            speed: Math.random() * 0.5 + 0.1,
            color: `hsl(${Math.random() * 60 + 200}, 80%, 60%)`
        }));
        setParticles(newParticles);
        
        return () => clearTimeout(timer);
    }, []);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    

    const handleStoryUpload = (newStory) => {
        setStories((prevStories) => [...prevStories, newStory]);
    };

   
    if (isLoading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loadingAnimation}>
                    <div style={styles.loadingCircle}></div>
                    <div style={styles.loadingCircle}></div>
                    <div style={styles.loadingCircle}></div>
                </div>
                <p style={styles.loadingText}>Initializing secure connection...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Background particles */}
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
                            animation: `float ${5/particle.speed}s infinite ease-in-out`
                        }}
                    />
                ))}
            </div>

            {/* 3D Glass Morphism Card for Story Upload */}
            <div 
                style={styles.storyUploadCard}
                onClick={() => setIsStoryModalOpen(true)}
            >
                <div style={styles.cardInner}>
                    <div style={styles.cardContent}>
                        <span style={styles.cardIcon}>📸</span>
                        <span style={styles.cardText}>Upload Story</span>
                    </div>
                    <div style={styles.cardGlow}></div>
                </div>
            </div>

            {/* Floating Action Button */}
            <div 
                style={styles.floatingButton}
                onClick={() => setIsModalOpen(true)}
            >
                <div style={styles.buttonInner}>
                    <span style={styles.buttonIcon}>+</span>
                    <span style={styles.buttonHoverText}>New Message</span>
                </div>
                <div style={styles.buttonPulse}></div>
            </div>

            {/* Message Form Modal */}
            {isModalOpen && (
                <div style={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <MessageForm onMessagePosted={() => setIsModalOpen(false)} />
                        <button style={styles.closeButton} onClick={() => setIsModalOpen(false)}>
                            ✖
                        </button>
                    </div>
                </div>
            )}

            {/* Story Uploader Modal */}
            {isStoryModalOpen && (
                <div style={styles.modalOverlay} onClick={() => setIsStoryModalOpen(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <StoryUploader onUpload={handleStoryUpload} />
                        <button style={styles.closeButton} onClick={() => setIsStoryModalOpen(false)}>
                            ✖
                        </button>
                    </div>
                </div>
            )}

            <div style={styles.contentWrapper}>
                <div style={styles.mainContent}>
                    <CategoryFilter onSelectCategory={handleCategorySelect} />
                    <MessageList selectedCategory={selectedCategory} />
                </div>

                <div style={styles.storyViewerContainer}>
                    <StoryViewer stories={stories} />
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: "100vh",
        width: "100%",
        margin: 0,
        padding: "20px",
        backgroundColor: "#0a0a1a",
        color: "#e0e0e0",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Segoe UI', 'Roboto', sans-serif",
    },
    
    // Loading Screen
    loadingContainer: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0a0a1a",
        zIndex: 1000,
    },
    loadingAnimation: {
        display: "flex",
        gap: "15px",
        marginBottom: "20px",
    },
    loadingCircle: {
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        backgroundColor: "#4f46e5",
        animation: "bounce 1.4s infinite ease-in-out",
    },
    loadingText: {
        color: "#a5b4fc",
        fontSize: "1.2rem",
        letterSpacing: "1px",
    },
    
    // Particle Background
    particleContainer: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        overflow: "hidden",
    },
    particle: {
        position: "absolute",
        borderRadius: "50%",
        opacity: 0.7,
        filter: "blur(1px)",
    },
    
    // Story Upload Card (3D Glass Effect)
    storyUploadCard: {
        position: "absolute",
        left: "5px",
        top: "77px",
        width: "180px",
        height: "210px",
        borderRadius: "20px",
        cursor: "pointer",
        perspective: "1000px",
        zIndex: 10,
        transformStyle: "preserve-3d",
        transition: "transform 0.5s ease",
    },
    cardInner: {
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: "20px",
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        transformStyle: "preserve-3d",
        transition: "all 0.5s ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    cardContent: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2,
        transform: "translateZ(30px)",
    },
    cardIcon: {
        fontSize: "3rem",
        marginBottom: "15px",
        color: "#a5b4fc",
    },
    cardText: {
        fontSize: "1.1rem",
        fontWeight: "500",
        color: "#e0e0e0",
    },
    cardGlow: {
        position: "absolute",
        width: "100px",
        height: "100px",
        background: "radial-gradient(circle, rgba(79, 70, 229, 0.8) 0%, rgba(79, 70, 229, 0) 70%)",
        borderRadius: "50%",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        filter: "blur(10px)",
        zIndex: 1,
        animation: "pulse 3s infinite alternate",
    },
    
    // Floating Action Button
    floatingButton: {
        position: "fixed",
        right: "30px",
        bottom: "30px",
        width: "70px",
        height: "70px",
        borderRadius: "50%",
        cursor: "pointer",
        zIndex: 10,
        transition: "all 0.3s ease",
    },
    buttonInner: {
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontSize: "2rem",
        fontWeight: "bold",
        boxShadow: "0 10px 25px rgba(79, 70, 229, 0.5)",
        zIndex: 2,
        overflow: "hidden",
        transition: "all 0.3s ease",
    },
    buttonIcon: {
        transition: "all 0.3s ease",
    },
    buttonHoverText: {
        position: "absolute",
        opacity: 0,
        fontSize: "0.8rem",
        whiteSpace: "nowrap",
        transition: "all 0.3s ease",
    },
    buttonPulse: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        background: "rgba(79, 70, 229, 0.4)",
        zIndex: 1,
        animation: "pulse 2s infinite",
    },
    
    // Content Layout
    contentWrapper: {
        display: "flex",
        flexDirection: "row",
        gap: "30px",
        maxWidth: "1400px",
        margin: "0 auto",
        paddingTop: "280px",
    },
    mainContent: {
        flex: 3,
        minWidth: 0,
    },
    storyViewerContainer: {
        flex: 1,
        minWidth: "300px",
        Width: "200px", // Ensures the StoryViewer has a minimum width
        overflowX: "auto", // Enables horizontal scroll
        whiteSpace: "nowrap", // Prevents the container from wrapping elements
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: "20px", // Space above the StoryViewer
        position: "absolute",
        left: "190px",
        right: "15px",
        top: "50px",
        height: "250px",
    },
    
   

  

    // Modal Styles
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
        backdropFilter: "blur(5px)",
        animation: "fadeIn 0.3s ease-in-out",
    },
    modalContent: {
        background: "linear-gradient(145deg, #1e1e2e, #2a2a3a)",
        width: "90%",
        maxWidth: "500px",
        padding: "30px",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
        position: "relative",
        textAlign: "center",
        animation: "slideUp 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
    },
    closeButton: {
        position: "absolute",
        top: "15px",
        right: "15px",
        background: "none",
        border: "none",
        fontSize: "24px",
        cursor: "pointer",
        color: "#a5b4fc",
        transition: "transform 0.2s ease",
    },
    
    // Responsive Styles
    "@media (max-width: 1024px)": {
        contentWrapper: {
            flexDirection: "column",
            paddingTop: "320px",
        },
        storyViewerContainer: {
            position: "relative",
            top: "auto",
            minWidth: "auto",
            marginLeft: 0,
            marginTop: "20px",
            flexDirection: "row", 
            justifyContent: "center",
        },
        storyUploadCard: {
            width: "150px",
            height: "200px",
        },
    },
    "@media (max-width: 768px)": {
        contentWrapper: {
            paddingTop: "250px",
        },
        storyUploadCard: {
            left: "10px",
            top: "10px",
            width: "120px",
            height: "160px",
        },
        cardIcon: {
            fontSize: "2rem",
        },
        cardText: {
            fontSize: "0.9rem",
        },
        floatingButton: {
            right: "20px",
            bottom: "20px",
            width: "60px",
            height: "60px",
        },
    },
    "@media (max-width: 480px)": {
        contentWrapper: {
            paddingTop: "200px",
        },
        storyUploadCard: {
            width: "100px",
            height: "140px",
        },
        cardIcon: {
            fontSize: "1.5rem",
            marginBottom: "10px",
        },
        cardText: {
            fontSize: "0.8rem",
        },
    },
};

// Animation styles
const additionalStyles = `
    @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
    }
    @keyframes slideUp {
        0% { transform: translateY(30px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
    }
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
    }
    @keyframes pulse {
        0% { transform: scale(0.95); opacity: 0.7; }
        100% { transform: scale(1.1); opacity: 0; }
    }
    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
    }
    
    /* Hover effects */
    .story-upload-card:hover {
        transform: translateY(-5px) rotateX(5deg) rotateY(-5deg);
    }
    .story-upload-card:hover .card-inner {
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
    }
    .floating-button:hover .button-inner {
        transform: scale(1.1);
    }
    .floating-button:hover .button-icon {
        opacity: 0;
    }
    .floating-button:hover .button-hover-text {
        opacity: 1;
    }
    .close-button:hover {
        transform: rotate(90deg);
    }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = additionalStyles;
document.head.appendChild(styleSheet);

export default Home;