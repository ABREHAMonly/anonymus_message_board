import { useState } from "react";
import { CloudUpload } from "lucide-react";
import axios from "../utils/api";

const StoryUploader = ({ onUpload }) => {
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        setImage(e.dataTransfer.files[0]);
    };

    const handleUpload = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("text", text);
            if (image) {
                formData.append("image", image);
            }

            const response = await axios.post("/stories/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setText("");
            setImage(null);
            setLoading(false);

            if (response.data && response.data.story) {
                onUpload(response.data.story);
            }
        } catch (err) {
            alert("Error uploading story");
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div
                style={{
                    ...styles.dropZone,
                    borderColor: dragOver ? "#0af" : "rgba(0, 170, 255, 0.3)",
                    background: dragOver ? "rgba(0, 100, 200, 0.2)" : "rgba(30, 35, 50, 0.5)",
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <CloudUpload 
                    size={50} 
                    color={dragOver ? "#0af" : "#a0a0a0"} 
                    style={{ filter: dragOver ? "drop-shadow(0 0 5px #0af)" : "none" }}
                />
                <p style={styles.dropText}>
                    {image ? image.name : "DRAG & DROP IMAGE OR CLICK TO UPLOAD"}
                </p>
                <input 
                    type="file" 
                    onChange={handleImageChange} 
                    style={styles.fileInput} 
                    accept="image/*"
                />
            </div>
            <textarea
                placeholder="WRITE YOUR STORY..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={styles.textarea}
            />
            <button 
                onClick={handleUpload} 
                style={{
                    ...styles.button,
                    ...(isHovered ? styles.buttonHover : {})
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                disabled={loading}
            >
                {loading ? "UPLOADING..." : "UPLOAD STORY"}
            </button>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        padding: "25px",
        backgroundColor: "rgba(20, 25, 40, 0.8)",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0, 170, 255, 0.1)",
        border: "1px solid rgba(0, 170, 255, 0.1)",
        width: "350px",
        alignItems: "center",
        fontFamily: "'Courier New', monospace",
    },
    dropZone: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: "2px dashed",
        borderRadius: "8px",
        padding: "25px",
        width: "100%",
        cursor: "pointer",
        position: "relative",
        transition: "all 0.3s ease",
        marginBottom: "15px",
    },
    dropText: {
        color: "#e0e0e0",
        fontSize: "14px",
        textAlign: "center",
        marginTop: "15px",
        letterSpacing: "1px",
    },
    fileInput: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        opacity: 0,
        cursor: "pointer",
    },
    textarea: {
        padding: "15px",
        marginTop: "10px",
        fontSize: "14px",
        borderRadius: "6px",
        border: "1px solid rgba(0, 170, 255, 0.3)",
        height: "100px",
        width: "100%",
        backgroundColor: "rgba(10, 15, 30, 0.7)",
        color: "#e0e0e0",
        resize: "none",
        fontFamily: "'Courier New', monospace",
        letterSpacing: "1px",
    },
    button: {
        padding: "12px",
        backgroundColor: "rgba(0, 100, 200, 0.3)",
        color: "#0af",
        border: "1px solid rgba(0, 170, 255, 0.5)",
        borderRadius: "6px",
        cursor: "pointer",
        width: "100%",
        marginTop: "15px",
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
            width: "300px",
            padding: "20px",
        },
        dropZone: {
            padding: "20px",
        },
    },
    "@media (max-width: 480px)": {
        container: {
            width: "280px",
            padding: "15px",
        },
        dropText: {
            fontSize: "12px",
        },
    },
};

export default StoryUploader;