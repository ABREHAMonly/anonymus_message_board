// components/CategoryFilter.js
import { useState, useEffect } from "react";
import axios from "../utils/api";
import { FaFilter, FaTimes } from 'react-icons/fa';

const CategoryFilter = ({ onSelectCategory }) => {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("/messages/categories");
                setCategories(response.data);
            } catch (err) {
                console.error("Error fetching categories", err);
            }
        };
        fetchCategories();
    }, []);

    const handleFilterClick = () => {
        setShowModal(!showModal);
    };

    const handleCategorySelect = (category) => {
        const newCategory = category === selectedCategory ? '' : category;
        setSelectedCategory(newCategory);
        onSelectCategory(newCategory);
        setShowModal(false);
    };

    return (
        <div style={styles.container}>
            <div 
                style={{
                    ...styles.filterButton,
                    ...(isHovered ? styles.filterButtonHover : {})
                }}
                onClick={handleFilterClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <FaFilter style={styles.filterIcon} />
                <span style={styles.filterText}>
                    {selectedCategory || "FILTER"}
                </span>
                <div style={styles.glowEffect}></div>
            </div>

            {showModal && (
                <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>SELECT CATEGORY</h3>
                            <button 
                                style={styles.closeButton}
                                onClick={() => setShowModal(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div style={styles.categoryGrid}>
                            <div 
                                onClick={() => handleCategorySelect('')}
                                style={{
                                    ...styles.categoryCard,
                                    ...(selectedCategory === '' ? styles.selectedCategory : {})
                                }}
                            >
                                ALL CATEGORIES
                            </div>
                            {categories.map((cat) => (
                                <div
                                    key={cat}
                                    onClick={() => handleCategorySelect(cat)}
                                    style={{
                                        ...styles.categoryCard,
                                        ...(selectedCategory === cat ? styles.selectedCategory : {})
                                    }}
                                >
                                    {cat.toUpperCase()}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    
    container: {
        position: 'relative',
        zIndex: 100,
    },
    filterButton: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 20px",
        backgroundColor: "rgba(30, 35, 50, 0.7)",
        borderRadius: "8px",
        border: "1px solid rgba(0, 170, 255, 0.2)",
        cursor: "pointer",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
    },
    filterButtonHover: {
        backgroundColor: "rgba(0, 100, 200, 0.3)",
        boxShadow: "0 0 15px rgba(0, 170, 255, 0.2)",
    },
    glowEffect: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        background: "linear-gradient(90deg, transparent, #0af, transparent)",
        opacity: 0,
        transition: "opacity 0.3s ease",
    },
    filterIcon: {
        color: "#0af",
        fontSize: "18px",
    },
    filterText: {
        color: "#e0e0e0",
        fontSize: "14px",
        fontWeight: "bold",
        letterSpacing: "1px",
        textTransform: "uppercase",
    },
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        backdropFilter: "blur(5px)",
    },
    modalContent: {
        backgroundColor: "rgba(20, 25, 40, 0.95)",
        borderRadius: "12px",
        padding: "20px",
        width: "90%",
        maxWidth: "500px",
        maxHeight: "80vh",
        overflowY: "auto",
        border: "1px solid rgba(0, 170, 255, 0.3)",
        boxShadow: "0 0 30px rgba(0, 170, 255, 0.2)",
    },
    modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        paddingBottom: "15px",
        borderBottom: "1px solid rgba(0, 170, 255, 0.2)",
    },
    modalTitle: {
        color: "#0af",
        margin: 0,
        fontSize: "18px",
        letterSpacing: "2px",
    },
    closeButton: {
        background: "rgba(255, 50, 50, 0.2)",
        border: "1px solid rgba(255, 50, 50, 0.5)",
        color: "#f55",
        borderRadius: "50%",
        width: "30px",
        height: "30px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        transition: "all 0.3s ease",
    },
    categoryGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
        gap: "15px",
    },
    categoryCard: {
        backgroundColor: "rgba(30, 35, 50, 0.7)",
        border: "1px solid rgba(0, 170, 255, 0.2)",
        borderRadius: "8px",
        padding: "15px",
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.3s ease",
        color: "#e0e0e0",
        fontSize: "14px",
        fontWeight: "bold",
        letterSpacing: "1px",
    },
    selectedCategory: {
        backgroundColor: "rgba(0, 170, 255, 0.3)",
        borderColor: "#0af",
        transform: "translateY(-3px)",
    },

    // Responsive styles
    "@media (max-width: 768px)": {
        filterButton: {
            padding: "10px 15px",
        },
        filterText: {
            fontSize: "12px",
        },
        categoryGrid: {
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
        },
    },
    "@media (max-width: 480px)": {
        filterButton: {
            padding: "8px 12px",
        },
        modalContent: {
            width: "95%",
            padding: "15px",
        },
        categoryCard: {
            padding: "10px",
            fontSize: "12px",
        },
    },
};
export default CategoryFilter;