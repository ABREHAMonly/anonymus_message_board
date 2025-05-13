import { useState } from "react";
import axios from "../utils/api";

const validateMessage = (text) => {
    if (!text || text.trim().length === 0) {
        return { valid: false, error: "Message cannot be empty." };
    }

    if (text.length > 500) {
        return { valid: false, error: "Message is too long (max 500 characters)." };
    }
 /* Detect and allow only safe links (Supported Links (Allowed)
    The following links will be allowed because they belong to trusted domains:
    
    https://example.com/article
    
    https://trustedsite.org/news
    
    https://securepage.net/resource
    
    http://example.com/info
    
    www.trustedsite.org/blog
    
    Unsupported Links (Blocked)
    The following links will be blocked because they either:
    
    Belong to untrusted domains
    
    Contain shortened URLs (which can hide malicious links)
    
    Use unsafe protocols like ftp:// or file://
    
    https://random-site.xyz/scam
    
    http://untrustednews.com/fake
    
    https://bit.ly/xyz123 (URL shorteners can hide malicious content)
    
    ftp://malicious-site.com/data
    
    www.spammywebsite.io/buy-now
    
    https://adult-content-site.com
    
    https://phishing-site.net/login
    
    file:///C:/Users/Hacker/Documents/malware.exe)*/
    // Basic spam detection (prevent repeated characters or words)
    const repeatedPattern = /(.)\1{6,}|(\b\w+\b)(\s+\2){3,}/i; 
    if (repeatedPattern.test(text)) {
        return { valid: false, error: "Message appears to be spam." };
    }

    /* Detect and allow only safe links */
    const linkPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/i;
    const safeDomains = ["example.com", "trustedsite.org", "securepage.net"];
    const containsUnsafeLink = linkPattern.test(text) && !safeDomains.some(domain => text.includes(domain));
    if (containsUnsafeLink) {
        return { valid: false, error: "Only secure and trusted links are allowed." };
    }

    // Detect common sexual or inappropriate words
    const inappropriateWords = ["sex", "porn", "nude", "xxx", "fuck", "bitch", "dick", "pussy", "asshole", "slut","ወሲብ","የወሲብ","ምስ","እምስ","ቁላ","መብዳት","ጀላ","ስለወሲብ","ሹገር","ሹገርማሚ","ሹገር ማሚ","መበዳት"];
    const containsInappropriateWord = inappropriateWords.some(word => text.toLowerCase().includes(word));
    if (containsInappropriateWord) {
        return { valid: false, error: "Message contains inappropriate content." };
    }

    return { valid: true };
};

const MessageForm = ({ onMessagePosted }) => {
    const [text, setText] = useState("");
    const [category, setCategory] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const validation = validateMessage(text);
        if (!validation.valid) {
            setError(validation.error);
            return;
        }

        if (!category) {
            setError("Please select a category.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("/messages", { text, category });
            onMessagePosted(response.data); // Refresh message list
            setText("");
            setCategory("");
            setSuccess("Message posted successfully!");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to post message.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>POST A MESSAGE</h2>
            {error && <p style={styles.error}>{error}</p>}
            {success && <p style={styles.success}>{success}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <textarea
                    style={styles.textarea}
                    rows="3"
                    placeholder="WRITE YOUR MESSAGE..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                ></textarea>
                <select
                    style={styles.select}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">ENTER CATEGORY</option>
                    <option value="All">All</option>
                    <option value="Student">Students</option>
                    <option value="Kids">Kid's</option>
                    <option value="Womens">Womens</option>
                    <option value="University">University Students</option>
                    <option value="Job">Job</option>
                </select>
                <button 
                    type="submit" 
                    style={styles.button} 
                    disabled={loading}
                >
                    {loading ? "POSTING..." : "POST MESSAGE"}
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        padding: "25px",
        backgroundColor: "rgba(20, 25, 40, 0.8)",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0, 170, 255, 0.1)",
        border: "1px solid rgba(0, 170, 255, 0.1)",
        maxWidth: "600px",
        margin: "0 auto",
        fontFamily: "'Courier New', monospace",
    },
    title: {
        fontSize: "22px",
        fontWeight: "bold",
        marginBottom: "20px",
        color: "#0af",
        textAlign: "center",
        letterSpacing: "2px",
        textShadow: "0 0 10px rgba(0, 170, 255, 0.3)",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    error: {
        color: "#f55",
        marginBottom: "15px",
        textAlign: "center",
        fontWeight: "bold",
        letterSpacing: "1px",
        backgroundColor: "rgba(255, 50, 50, 0.1)",
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid rgba(255, 50, 50, 0.3)",
    },
    success: {
        color: "#0f0",
        marginBottom: "15px",
        textAlign: "center",
        fontWeight: "bold",
        letterSpacing: "1px",
        backgroundColor: "rgba(0, 255, 50, 0.1)",
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid rgba(0, 255, 50, 0.3)",
    },
    textarea: {
        width: "100%",
        padding: "15px",
        borderRadius: "8px",
        border: "1px solid rgba(0, 170, 255, 0.3)",
        resize: "none",
        backgroundColor: "rgba(10, 15, 30, 0.7)",
        color: "#e0e0e0",
        fontFamily: "'Courier New', monospace",
        letterSpacing: "1px",
        minHeight: "120px",
    },
    select: {
        width: "100%",
        padding: "15px",
        borderRadius: "8px",
        border: "1px solid rgba(0, 170, 255, 0.3)",
        backgroundColor: "rgba(10, 15, 30, 0.7)",
        color: "#e0e0e0",
        fontFamily: "'Courier New', monospace",
        letterSpacing: "1px",
        appearance: "none",
        backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230af'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 15px center",
        backgroundSize: "20px",
    },
    button: {
        marginTop: "10px",
        backgroundColor: "rgba(0, 100, 200, 0.3)",
        color: "#0af",
        padding: "15px",
        borderRadius: "8px",
        border: "1px solid rgba(0, 170, 255, 0.5)",
        cursor: "pointer",
        fontWeight: "bold",
        letterSpacing: "1px",
        textTransform: "uppercase",
        transition: "all 0.3s ease",
    },
    buttonHover: {
        backgroundColor: "rgba(0, 100, 200, 0.5)",
        boxShadow: "0 0 15px rgba(0, 170, 255, 0.3)",
    },
    // Responsive styles
    "@media (max-width: 768px)": {
        container: {
            padding: "20px",
        },
        textarea: {
            padding: "12px",
        },
        select: {
            padding: "12px",
        },
        button: {
            padding: "12px",
        },
    },
    "@media (max-width: 480px)": {
        container: {
            padding: "15px",
        },
        title: {
            fontSize: "18px",
        },
        textarea: {
            padding: "10px",
        },
        select: {
            padding: "10px",
            backgroundPosition: "right 10px center",
        },
        button: {
            padding: "12px",
        },
    },
};

export default MessageForm;