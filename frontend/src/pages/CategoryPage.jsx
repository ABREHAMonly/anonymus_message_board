import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MessageList from "../components/MessageList";
import CategoryFilter from "../components/CategoryFilter";

const CategoryPage = () => {
    const { category } = useParams();
    const [selectedCategory, setSelectedCategory] = useState(category);
    const [isLoading, setIsLoading] = useState(true);
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        setSelectedCategory(category);
        
        // Simulate loading
        const timer = setTimeout(() => setIsLoading(false), 1000);
        
        // Create background particles
        const newParticles = Array.from({ length: 20 }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            speed: Math.random() * 0.5 + 0.1,
            color: `hsl(${Math.random() * 60 + 200}, 80%, 60%)`
        }));
        setParticles(newParticles);
        
        return () => clearTimeout(timer);
    }, [category]);

    const handleCategorySelect = (newCategory) => {
        setSelectedCategory(newCategory);
    };

    if (isLoading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loadingAnimation}>
                    <div style={styles.loadingOrb}></div>
                    <div style={styles.loadingOrb}></div>
                    <div style={styles.loadingOrb}></div>
                </div>
                <p style={styles.loadingText}>Loading category data...</p>
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

            {/* 3D Category Title */}
            <div style={styles.titleContainer}>
                <h1 style={styles.title}>
                    <span style={styles.titleText}>Category:</span>
                    <span style={styles.categoryName}>{selectedCategory}</span>
                </h1>
                <div style={styles.titleGlow}></div>
                
            </div>
            <div style={styles.filterContainer}>
                    <CategoryFilter onSelectCategory={handleCategorySelect} />
                </div>

            {/* Glass Morphism Content Area */}
            <div style={styles.contentArea}>
                
                
                <div style={styles.messageListContainer}>
                    <MessageList selectedCategory={selectedCategory} />
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
        paddingTop: "100px",
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
    loadingOrb: {
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        background: "radial-gradient(circle, #4f46e5, #8b5cf6)",
        boxShadow: "0 0 15px #4f46e5",
        animation: "pulse 1.4s infinite ease-in-out",
    },
    loadingText: {
        color: "#a5b4fc",
        fontSize: "1.2rem",
        letterSpacing: "1px",
        textTransform: "uppercase",
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
    
    // Title Section
    titleContainer: {
        position: "relative",
        textAlign: "center",
        marginBottom: "40px",
        perspective: "1000px",
    },
    title: {
        fontSize: "2.5rem",
        fontWeight: "700",
        background: "linear-gradient(90deg, #a5b4fc, #8b5cf6)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        display: "inline-block",
        padding: "0 20px",
        position: "relative",
        zIndex: 2,
        textShadow: "0 2px 10px rgba(165, 180, 252, 0.3)",
        animation: "fadeIn 0.5s ease-out, floatTitle 6s infinite ease-in-out",
    },
    titleText: {
        display: "block",
        fontSize: "1.2rem",
        fontWeight: "400",
        marginBottom: "5px",
    },
    categoryName: {
        display: "block",
        fontSize: "2.8rem",
        fontWeight: "800",
        textTransform: "capitalize",
    },
    titleGlow: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "300px",
        height: "300px",
        background: "radial-gradient(circle, rgba(79, 70, 229, 0.3) 0%, rgba(79, 70, 229, 0) 70%)",
        borderRadius: "50%",
        filter: "blur(20px)",
        zIndex: 1,
        animation: "pulse 4s infinite alternate",
    },
    
    // Content Area
    contentArea: {
        maxWidth: "1200px",
        margin: "0 auto",
        background: "rgba(30, 30, 46, 0.7)",
        backdropFilter: "blur(10px)",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        animation: "slideUp 0.6s cubic-bezier(0.18, 0.89, 0.32, 1.28)",
    },
    filterContainer: {
        marginBottom: "30px",
    },
    messageListContainer: {
        minHeight: "500px",
    },
    
    // Responsive Styles
    "@media (max-width: 1024px)": {
        title: {
            fontSize: "2rem",
        },
        categoryName: {
            fontSize: "2.2rem",
        },
        contentArea: {
            padding: "20px",
        },
    },
    "@media (max-width: 768px)": {
        title: {
            fontSize: "1.8rem",
        },
        titleText: {
            fontSize: "1rem",
        },
        categoryName: {
            fontSize: "1.8rem",
        },
        contentArea: {
            padding: "15px",
        },
    },
    "@media (max-width: 480px)": {
        container: {
            paddingTop: "80px",
        },
        title: {
            fontSize: "1.5rem",
            padding: "0 10px",
        },
        titleText: {
            fontSize: "0.9rem",
        },
        categoryName: {
            fontSize: "1.4rem",
        },
        titleGlow: {
            width: "200px",
            height: "200px",
        },
    },
};

// Animation styles
const additionalStyles = `
    @keyframes fadeIn {
        0% { opacity: 0; transform: translateY(-20px); }
        100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideUp {
        0% { transform: translateY(30px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
    }
    @keyframes pulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
    }
    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-15px); }
    }
    @keyframes floatTitle {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
    }
    
    /* Hover effects */
    .category-filter-item:hover {
        transform: scale(1.05);
        box-shadow: 0 0 15px rgba(165, 180, 252, 0.5);
    }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = additionalStyles;
document.head.appendChild(styleSheet);

export default CategoryPage;