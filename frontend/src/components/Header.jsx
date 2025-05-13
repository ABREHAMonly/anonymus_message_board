import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminPage from "../pages/AdminPage";

const Header = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const lastScrollY = useRef(0);
    const navigate = useNavigate();
    const headerRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > lastScrollY.current && window.scrollY > 50) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            lastScrollY.current = window.scrollY;
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <header
                ref={headerRef}
                style={{
                    ...styles.header,
                    ...(isScrolled ? styles.headerScrolled : {}),
                    transform: isVisible ? "translateY(0)" : "translateY(-100%)",
                    backdropFilter: isScrolled ? "blur(10px)" : "none",
                }}
            >
                <div style={styles.container}>
                    {/* Logo */}
                    <div 
                        style={styles.logoContainer} 
                        onClick={() => navigate("/")}
                        className="neon-hover"
                    >
                        <span style={styles.logo}>⎔</span>
                        <span style={styles.logoText}>ANONYMUS</span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav style={styles.nav}>
                        <button 
                            style={styles.navLink} 
                            onClick={() => navigate("/")}
                            className="nav-link-hover"
                        >
                            <span style={styles.navIcon}>⌂</span> HOME
                        </button>
                        <button 
                            style={styles.navLink} 
                            onClick={() => navigate("/categories")}
                            className="nav-link-hover"
                        >
                            <span style={styles.navIcon}>≡</span> CATEGORIES
                        </button>
                        <button 
                            style={styles.navLink} 
                            onClick={() => setIsAdminModalOpen(true)}
                            className="nav-link-hover"
                        >
                            <span style={styles.navIcon}>⚙</span> ADMIN
                        </button>
                    </nav>

                    {/* Mobile Navigation */}
                    <nav 
                        style={{ 
                            ...styles.navMobile,
                            display: isMobileMenuOpen ? "flex" : "none",
                        }}
                    >
                        <button 
                            style={styles.navLink} 
                            onClick={() => {
                                navigate("/");
                                setIsMobileMenuOpen(false);
                            }}
                        >
                            <span style={styles.navIcon}>⌂</span> HOME
                        </button>
                        <button 
                            style={styles.navLink} 
                            onClick={() => {
                                navigate("/categories");
                                setIsMobileMenuOpen(false);
                            }}
                        >
                            <span style={styles.navIcon}>≡</span> CATEGORIES
                        </button>
                        <button 
                            style={styles.navLink} 
                            onClick={() => {
                                setIsAdminModalOpen(true);
                                setIsMobileMenuOpen(false);
                            }}
                        >
                            <span style={styles.navIcon}>⚙</span> ADMIN
                        </button>
                    </nav>

                    {/* Hamburger Menu */}
                    <div 
                        style={styles.hamburger} 
                        onClick={handleMobileMenuToggle}
                    >
                        <div 
                            style={{ 
                                ...styles.bar,
                                transform: isMobileMenuOpen ? "rotate(45deg) translate(5px, 5px)" : "none"
                            }} 
                        />
                        <div 
                            style={{ 
                                ...styles.bar,
                                opacity: isMobileMenuOpen ? 0 : 1 
                            }} 
                        />
                        <div 
                            style={{ 
                                ...styles.bar,
                                transform: isMobileMenuOpen ? "rotate(-45deg) translate(7px, -7px)" : "none"
                            }} 
                        />
                    </div>
                </div>
            </header>

            {/* Admin Modal */}
            {isAdminModalOpen && (
                <div 
                    style={styles.modalOverlay} 
                    onClick={() => setIsAdminModalOpen(false)}
                >
                    <div 
                        style={styles.modalContent} 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <AdminPage />
                        <button 
                            style={styles.closeButton} 
                            onClick={() => setIsAdminModalOpen(false)}
                        >
                            TERMINATE SESSION
                        </button>
                    </div>
                </div>
            )}

            {/* Global Styles */}
            <style>{`
                /* Custom Scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: rgba(10, 15, 30, 0.5);
                }
                ::-webkit-scrollbar-thumb {
                    background: #0af;
                    border-radius: 4px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 170, 255, 0.8);
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .desktop-nav {
                        display: none !important;
                    }
                    
                    .mobile-nav {
                        display: flex !important;
                    }
                }

                /* Animations */
                .neon-hover:hover {
                    text-shadow: 0 0 10px #0af, 0 0 20px #0af;
                    transition: text-shadow 0.3s ease;
                }

                .nav-link-hover:hover {
                    color: #0af !important;
                    text-shadow: 0 0 5px rgba(0, 170, 255, 0.5);
                }

                .nav-link-hover:hover span {
                    transform: scale(1.2);
                }
            `}</style>
        </>
    );
};

const styles = {
    header: {
        background: "rgba(10, 15, 30, 0.7)",
        color: "#e0e0e0",
        padding: "15px 0",
        position: "fixed",
        width: "100%",
        top: 0,
        zIndex: 1000,
        transition: "all 0.4s ease",
        borderBottom: "1px solid rgba(0, 170, 255, 0.1)",
    },
    headerScrolled: {
        background: "rgba(5, 10, 20, 0.9)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
    },
    container: {
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 25px",
    },
    logoContainer: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        cursor: "pointer",
    },
    logo: {
        fontSize: "28px",
        color: "#0af",
        filter: "drop-shadow(0 0 5px rgba(0, 170, 255, 0.5))",
    },
    logoText: {
        fontSize: "20px",
        fontWeight: "bold",
        letterSpacing: "2px",
        textTransform: "uppercase",
    },
    nav: {
        display: "flex",
        gap: "25px",
    },
    navMobile: {
        display: "none",
        flexDirection: "column",
        position: "absolute",
        top: "70px",
        right: "25px",
        background: "rgba(10, 15, 30, 0.95)",
        width: "220px",
        padding: "20px",
        borderRadius: "8px",
        zIndex: 2000,
        border: "1px solid rgba(0, 170, 255, 0.2)",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
    },
    navLink: {
        background: "none",
        border: "none",
        color: "#e0e0e0",
        fontSize: "16px",
        cursor: "pointer",
        padding: "10px 15px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "all 0.3s ease",
    },
    navIcon: {
        fontSize: "18px",
        transition: "transform 0.3s ease",
    },
    hamburger: {
        display: "none",
        flexDirection: "column",
        gap: "6px",
        cursor: "pointer",
        padding: "10px",
        zIndex: 3000,
    },
    bar: {
        width: "30px",
        height: "2px",
        background: "#0af",
        transition: "all 0.3s ease",
    },
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
        zIndex: 4000,
        backdropFilter: "blur(5px)",
    },
    modalContent: {
        background: "rgba(20, 25, 40, 0.95)",
        padding: "30px",
        borderRadius: "12px",
        maxWidth: "500px",
        width: "90%",
        border: "1px solid rgba(0, 170, 255, 0.3)",
        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.4)",
    },
    closeButton: {
        marginTop: "20px",
        padding: "12px 25px",
        border: "1px solid rgba(255, 30, 50, 0.5)",
        background: "rgba(255, 30, 50, 0.2)",
        color: "#f55",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "bold",
        transition: "all 0.3s ease",
    },
};

export default Header;