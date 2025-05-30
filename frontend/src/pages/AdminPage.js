import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [particles, setParticles] = useState([]);
  const [csrfToken, setCsrfToken] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize particles
    setParticles(Array.from({ length: 15 }, createParticle));

    // Check existing session
    const verifySession = async () => {
      const token = localStorage.getItem("adminToken");
      if (token) {
        try {
          const response = await fetch("https://anonymus-message-board.onrender.com/api/admin/verify", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) navigate("/admin-dashboard");
        } catch (error) {
          localStorage.removeItem("adminToken");
        }
      }
    };



    verifySession();
  }, [navigate]);

  const createParticle = () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    speed: Math.random() * 0.3 + 0.2,
    color: `hsl(${Math.random() * 60 + 200}, 80%, 60%)`,
    delay: Math.random() * 5
  });

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return password.length >= minLength && hasUpperCase && hasNumber;
  };

  const sanitizeInput = (input) => {
    return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    // Input validation
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedPassword = sanitizeInput(password);

    if (!sanitizedUsername || !sanitizedPassword) {
      setError("All fields are required");
      return;
    }

    if (!validatePassword(sanitizedPassword)) {
      setError("Password must be 8+ chars with uppercase and number");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("https://anonymus-message-board.onrender.com/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          username: sanitizedUsername, 
          password: sanitizedPassword 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const attempts = loginAttempts + 1;
        setLoginAttempts(attempts);
        
        if (attempts >= 3) {
          setIsLocked(true);
          setTimeout(() => {
            setIsLocked(false);
            setLoginAttempts(0);
          }, 30000);
        }

        throw new Error(data.message || "Authentication failed");
      }

      // Store token and redirect
      localStorage.setItem("adminToken", data.token);
      setTimeout(() => navigate("/admin-dashboard"), 1000);

    } catch (err) {
      setError(err.message || "Security breach detected");
      setAccessDenied(true);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.scanLine}></div>
        <div style={styles.securityCheck}>
          <div style={styles.checkIcon}>🔒</div>
          <p style={styles.checkText}>Verifying credentials...</p>
          <div style={styles.progressBar}>
            <div style={styles.progressFill}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
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
              animation: `scan ${5/particle.speed}s ${particle.delay}s infinite linear`,
              opacity: 0.7,
            }}
          />
        ))}
      </div>

      <div style={styles.loginCard}>
        <div style={styles.securityHeader}>
          <div style={styles.lockIcon}>🔐</div>
          <h2 style={styles.heading}>SECURE ADMIN PORTAL</h2>
          <div style={styles.securityLevel}>
            <span style={styles.securityText}>SECURITY LEVEL:</span>
            <span style={styles.securityStatus}>
              {isLocked ? "LOCKED" : "MAXIMUM"}
            </span>
          </div>
        </div>

        {accessDenied && <div style={styles.deniedScanLine}></div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputContainer}>
            <label htmlFor="username" style={styles.label}>
              <span style={styles.labelIcon}>👤</span>
              USER IDENTIFICATION
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
              autoComplete="off"
              disabled={isLocked}
            />
            <div style={styles.inputUnderline}></div>
          </div>

          <div style={styles.inputContainer}>
            <label htmlFor="password" style={styles.label}>
              <span style={styles.labelIcon}>🔑</span>
              ENCRYPTION KEY
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
              autoComplete="off"
              disabled={isLocked}
            />
            <div style={styles.inputUnderline}></div>
          </div>

          {error && (
            <div style={styles.errorContainer}>
              <div style={styles.errorIcon}>⚠️</div>
              <p style={styles.errorText}>{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            style={styles.button}
            disabled={isLoading || isLocked}
          >
            {isLoading ? (
              <span style={styles.buttonLoader}></span>
            ) : (
              <>
                <span style={styles.buttonIcon}>⏻</span>
                {isLocked ? "SYSTEM LOCKED" : "INITIATE SYSTEM ACCESS"}
              </>
            )}
          </button>
        </form>

        {isLocked && (
          <div style={styles.lockWarning}>
            <p>System locked for 30 seconds due to multiple failed attempts</p>
          </div>
        )}

        <div style={styles.footer}>
          <span style={styles.footerText}>CONNECTION: {csrfToken ? "SECURE" : "UNSECURE"}</span>
          <span style={styles.footerText}>IP: 192.168.1.███</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a1a",
    fontFamily: "'Courier New', monospace",
    position: "relative",
    overflow: "hidden",
    padding: "20px",
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
    color: "#0af",
  },
  scanLine: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "2px",
    background: "linear-gradient(90deg, transparent, #0af, transparent)",
    animation: "scanLoad 2s linear infinite",
    boxShadow: "0 0 10px #0af",
  },
  securityCheck: {
    textAlign: "center",
    padding: "30px",
    border: "1px solid rgba(0, 170, 255, 0.3)",
    borderRadius: "5px",
    background: "rgba(0, 10, 20, 0.7)",
    maxWidth: "300px",
    width: "100%",
  },
  checkIcon: {
    fontSize: "3rem",
    marginBottom: "15px",
    animation: "pulse 1.5s infinite",
  },
  checkText: {
    marginBottom: "20px",
    letterSpacing: "1px",
  },
  progressBar: {
    height: "4px",
    width: "100%",
    backgroundColor: "rgba(0, 170, 255, 0.2)",
    borderRadius: "2px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    width: "0%",
    backgroundColor: "#0af",
    animation: "progressLoad 1s forwards",
  },

  // Particle Background
  particleContainer: {
    position: "absolute",
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
    filter: "blur(1px)",
    transform: "translateY(100vh)",
  },

  // Login Card
  loginCard: {
    width: "100%",
    maxWidth: "450px",
    padding: "30px",
    backgroundColor: "rgba(10, 15, 30, 0.8)",
    borderRadius: "10px",
    boxShadow: "0 0 30px rgba(0, 170, 255, 0.2)",
    border: "1px solid rgba(0, 170, 255, 0.1)",
    position: "relative",
    overflow: "hidden",
    animation: "fadeIn 0.5s ease-out",
  },

  // Security Header
  securityHeader: {
    textAlign: "center",
    marginBottom: "30px",
    position: "relative",
  },
  lockIcon: {
    fontSize: "2.5rem",
    marginBottom: "10px",
    color: "#0af",
    filter: "drop-shadow(0 0 5px #0af)",
  },
  heading: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    color: "#0af",
    letterSpacing: "2px",
    marginBottom: "10px",
    textShadow: "0 0 10px rgba(0, 170, 255, 0.5)",
  },
  securityLevel: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    fontSize: "0.9rem",
    color: "#ccc",
  },
  securityText: {
    opacity: 0.7,
  },
  securityStatus: {
    color: "#f00",
    fontWeight: "bold",
    textShadow: "0 0 5px rgba(255, 0, 0, 0.5)",
  },

  // Form Elements
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
  inputContainer: {
    position: "relative",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.8rem",
    color: "#0af",
    marginBottom: "8px",
    letterSpacing: "1px",
  },
  labelIcon: {
    fontSize: "1rem",
  },
  input: {
    width: "100%",
    padding: "12px 10px",
    fontSize: "0.9rem",
    backgroundColor: "rgba(0, 10, 20, 0.7)",
    border: "1px solid rgba(0, 170, 255, 0.3)",
    borderRadius: "4px",
    color: "#fff",
    outline: "none",
    fontFamily: "'Courier New', monospace",
    letterSpacing: "1px",
    transition: "all 0.3s ease",
  },
  inputUnderline: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "0%",
    height: "2px",
    backgroundColor: "#0af",
    transition: "width 0.3s ease",
  },
  inputFocus: {
    borderColor: "#0af",
    boxShadow: "0 0 10px rgba(0, 170, 255, 0.3)",
  },
  inputFocusUnderline: {
    width: "100%",
  },

  // Error Message
  errorContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    border: "1px solid rgba(255, 0, 0, 0.3)",
    borderRadius: "4px",
  },
  errorIcon: {
    fontSize: "1.2rem",
  },
  errorText: {
    color: "#f55",
    fontSize: "0.9rem",
    margin: 0,
  },

  // Button
  button: {
    padding: "14px",
    backgroundColor: "rgba(0, 100, 255, 0.2)",
    color: "#0af",
    border: "1px solid #0af",
    borderRadius: "4px",
    fontSize: "0.9rem",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    letterSpacing: "1px",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
  },
  buttonHover: {
    backgroundColor: "rgba(0, 100, 255, 0.4)",
    boxShadow: "0 0 15px rgba(0, 170, 255, 0.5)",
  },
  buttonIcon: {
    fontSize: "1.2rem",
  },
  buttonLoader: {
    width: "20px",
    height: "20px",
    border: "3px solid rgba(0, 170, 255, 0.3)",
    borderTop: "3px solid #0af",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  // Denied Effect
  deniedScanLine: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "2px",
    background: "linear-gradient(90deg, transparent, #f00, transparent)",
    animation: "scanDenied 0.5s linear",
    boxShadow: "0 0 10px #f00",
  },

  // Footer
  footer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "30px",
    fontSize: "0.7rem",
    color: "rgba(0, 170, 255, 0.5)",
    borderTop: "1px solid rgba(0, 170, 255, 0.1)",
    paddingTop: "15px",
  },
  footerText: {
    letterSpacing: "1px",
  },

  lockWarning: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    border: '1px solid rgba(255, 0, 0, 0.3)',
    borderRadius: '4px',
    padding: '10px',
    marginTop: '15px',
    textAlign: 'center',
    color: '#f55',
    fontSize: '0.8rem',
  },
  securityStatus: {
    color: isLocked => isLocked ? '#f00' : '#0af',
    fontWeight: 'bold',
    textShadow: isLocked => 
      isLocked ? '0 0 5px rgba(255, 0, 0, 0.5)' : '0 0 5px rgba(0, 170, 255, 0.5)'
  },
  // Responsive Styles
  "@media (max-width: 768px)": {
    loginCard: {
      padding: "20px",
    },
    heading: {
      fontSize: "1.1rem",
    },
  },
  "@media (max-width: 480px)": {
    loginCard: {
      padding: "15px",
    },
    footer: {
      flexDirection: "column",
      gap: "5px",
    },
  },
};

// Animation styles
const additionalStyles = `
  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(-20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes scan {
    0% { transform: translateY(-100px); opacity: 0; }
    10%, 90% { opacity: 0.7; }
    100% { transform: translateY(100vh); opacity: 0; }
  }
  @keyframes scanLoad {
    0% { transform: translateY(0); }
    100% { transform: translateY(100vh); }
  }
  @keyframes scanDenied {
    0% { transform: translateY(0); }
    100% { transform: translateY(100vh); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.8; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
  }
  @keyframes progressLoad {
    0% { width: 0%; }
    100% { width: 100%; }
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Hover effects */
  input:focus {
    border-color: #0af;
    box-shadow: 0 0 10px rgba(0, 170, 255, 0.3);
  }
  input:focus + div {
    width: 100%;
  }
  button:hover {
    background-color: rgba(0, 100, 255, 0.4);
    box-shadow: 0 0 15px rgba(0, 170, 255, 0.5);
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = additionalStyles;
document.head.appendChild(styleSheet);

export default AdminPage;