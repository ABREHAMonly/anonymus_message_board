import React from 'react';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            {/* Glowing bottom border */}
            <div style={styles.glowBar}></div>
            
            {/* Main footer content */}
            <div style={styles.contentContainer}>
                {/* Copyright text with animated hover */}
                <p style={styles.text} className="footer-text-hover">
                    © {new Date().getFullYear()} ANONYMUS NETWORK
                </p>
                
                {/* System status indicator */}
                <div style={styles.systemStatus}>
                    <span style={styles.statusIndicator}></span>
                    <span style={styles.statusText}>SYSTEM STATUS: ONLINE</span>
                </div>
                
                {/* Cyberpunk-style decorative elements */}
                <div style={styles.decorativeElements}>
                    <span style={styles.decorativeLine}></span>
                    <span style={styles.decorativeHex}>⎔</span>
                    <span style={styles.decorativeLine}></span>
                </div>
            </div>
            
            {/* Dynamic CSS */}
            <style jsx>{`
                .footer-text-hover:hover {
                    text-shadow: 0 0 10px rgba(0, 170, 255, 0.7);
                    color: #0af;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.8; }
                    50% { opacity: 1; }
                }
                @keyframes scanline {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
            `}</style>
        </footer>
    );
};

const styles = {
    footer: {
        backgroundColor: "rgba(10, 15, 30, 0.9)",
        color: "#e0e0e0",
        padding: "30px 0 20px",
        marginTop: "60px",
        textAlign: "center",
        position: "relative",
        borderTop: "1px solid rgba(0, 170, 255, 0.1)",
        boxShadow: "0 -5px 30px rgba(0, 0, 0, 0.3)",
        fontFamily: "'Courier New', monospace",
        letterSpacing: "1px",
        overflow: "hidden",
    },
    glowBar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        background: "linear-gradient(90deg, transparent, #0af, transparent)",
        boxShadow: "0 0 10px #0af",
    },
    contentContainer: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "15px",
    },
    text: {
        fontSize: "14px",
        margin: 0,
        color: "#a0a0a0",
        transition: "all 0.3s ease",
        textTransform: "uppercase",
    },
    systemStatus: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginTop: "5px",
    },
    statusIndicator: {
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        backgroundColor: "#0f0",
        boxShadow: "0 0 10px #0f0",
        animation: "pulse 2s infinite",
    },
    statusText: {
        fontSize: "12px",
        color: "#0af",
        letterSpacing: "2px",
    },
    decorativeElements: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        marginTop: "20px",
        width: "100%",
        maxWidth: "300px",
    },
    decorativeLine: {
        flex: 1,
        height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(0, 170, 255, 0.5), transparent)",
    },
    decorativeHex: {
        color: "#0af",
        fontSize: "20px",
        opacity: 0.7,
    },

    // Responsive styles
    "@media (max-width: 768px)": {
        footer: {
            padding: "25px 0 15px",
        },
        text: {
            fontSize: "12px",
        },
        statusText: {
            fontSize: "10px",
        },
    },
};

export default Footer;