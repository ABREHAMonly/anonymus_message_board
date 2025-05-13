import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [particles] = useState(Array.from({ length: 25 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    speed: Math.random() * 0.3 + 0.2,
    color: `hsl(${Math.random() * 60 + 200}, 80%, 60%)`,
    delay: Math.random() * 5
  })));

  const [admins, setAdmins] = useState([]);
  const [adminForm, setAdminForm] = useState({
    username: '',
    password: '',
    editingId: null
  });
  const [adminError, setAdminError] = useState('');
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [activeSection, setActiveSection] = useState('messages');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          navigate('/admin');
          return;
        }

        if (activeSection === 'messages') {
          const messagesRes = await fetch('http://localhost:5000/api/messages', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const messagesData = await messagesRes.json();
          setMessages(messagesData);
          setFilteredMessages(messagesData);
        } else {
          const adminsRes = await fetch('http://localhost:5000/api/admin/admins', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const adminsData = await adminsRes.json();
          setAdmins(adminsData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeSection, navigate]);

  const deleteMessage = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/message/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setMessages(messages.filter(msg => msg._id !== id));
        setFilteredMessages(filteredMessages.filter(msg => msg._id !== id));
      }
    } catch (error) {
      console.error('Delete message error:', error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredMessages(
      messages.filter(msg => 
        msg.text.toLowerCase().includes(query) &&
        (activeTab === 'all' || msg.category === activeTab)
      )
    );
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setAdminError('');
    try {
      const token = localStorage.getItem('adminToken');
      const url = adminForm.editingId 
        ? `http://localhost:5000/api/admin/admins/${adminForm.editingId}`
        : 'http://localhost:5000/api/admin/admins';

      const response = await fetch(url, {
        method: adminForm.editingId ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adminForm)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Operation failed');

      setAdmins(adminForm.editingId
        ? admins.map(a => a._id === adminForm.editingId ? data.user : a)
        : [data.user, ...admins]
      );
      setShowAdminForm(false);
      setAdminForm({ username: '', password: '', editingId: null });
    } catch (error) {
      setAdminError(error.message);
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await fetch(`http://localhost:5000/api/admin/admins/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setAdmins(admins.filter(a => a._id !== id));
      } catch (error) {
        setAdminError('Failed to delete admin');
      }
    }
  };

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
              animation: `float ${5/particle.speed}s ${particle.delay}s infinite ease-in-out`,
            }}
          />
        ))}
      </div>
      {selectedMessage && (
          <div style={styles.modalOverlay} onClick={() => setSelectedMessage(null)}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button style={styles.closeModal} onClick={() => setSelectedMessage(null)}>
                ✕
              </button>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>MESSAGE DETAILS</h3>
                <span style={styles.modalCategory}>
                  {selectedMessage.category}
                </span>
              </div>
              <div style={styles.modalBody}>
                <p style={styles.modalText}>{selectedMessage.text}</p>
                <div style={styles.modalMeta}>
                  <div style={styles.metaItem}>
                    <span style={styles.metaLabel}>CREATED:</span>
                    <span style={styles.metaValue}>
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {selectedMessage.updatedAt && (
                    <div style={styles.metaItem}>
                      <span style={styles.metaLabel}>UPDATED:</span>
                      <span style={styles.metaValue}>
                        {new Date(selectedMessage.updatedAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div style={styles.modalActions}>
                <button 
                  onClick={() => {
                    deleteMessage(selectedMessage._id);
                    setSelectedMessage(null);
                  }}
                  style={styles.modalDeleteButton}
                >
                  DELETE MESSAGE
                </button>
              </div>
            </div>
          </div>
        )}

      <div style={styles.dashboardContainer}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.title}>CYBER ADMIN CONSOLE</h1>
            <p style={styles.subtitle}>Secure Management Interface</p>
          </div>
          
          <div style={styles.headerRight}>
            <div style={styles.searchContainer}>
              <input
                type="text"
                placeholder="SEARCH..."
                value={searchQuery}
                onChange={handleSearch}
                style={styles.searchInput}
                disabled={activeSection !== 'messages'}
              />
              <span style={styles.searchIcon}>🔍</span>
            </div>
            
            <button 
              onClick={() => {
                localStorage.removeItem('adminToken');
                navigate('/admin');
              }} 
              style={styles.logoutButton}
            >
              <span style={styles.logoutIcon}>⏻</span> LOGOUT
            </button>
          </div>
        </div>

        <div style={styles.navTabs}>
          <button
            style={{
              ...styles.navTab,
              ...(activeSection === 'messages' && styles.activeNavTab)
            }}
            onClick={() => setActiveSection('messages')}
          >
            MESSAGES
          </button>
          <button
            style={{
              ...styles.navTab,
              ...(activeSection === 'admins' && styles.activeNavTab)
            }}
            onClick={() => setActiveSection('admins')}
          >
            ADMIN USERS
          </button>
        </div>

        {activeSection === 'messages' ? (
          <>
            <div style={styles.statsContainer}>
              <div style={styles.statCard}>
                <span style={styles.statNumber}>{messages.length}</span>
                <span style={styles.statLabel}>TOTAL MESSAGES</span>
              </div>
              <div style={styles.filterTabs}>
                {['all', 'general', 'feedback', 'question', 'other'].map(category => (
                  <button
                    key={category}
                    style={{
                      ...styles.filterTab,
                      ...(activeTab === category && styles.activeFilterTab)
                    }}
                    onClick={() => setActiveTab(category)}
                  >
                    {category.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div style={styles.loadingGrid}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} style={styles.skeletonCard}>
                    <div style={styles.skeletonLine} />
                    <div style={styles.skeletonLine} />
                  </div>
                ))}
              </div>
            ) : filteredMessages.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📭</div>
                <p style={styles.emptyText}>NO MESSAGES FOUND</p>
              </div>
            ) : (
              <div style={styles.messagesGrid}>
                {filteredMessages.map(msg => (
                  <div key={msg._id} style={styles.messageCard}>
                    <div style={styles.messageHeader}>
                      <span style={styles.messageCategory}>{msg.category}</span>
                      <span style={styles.messageDate}>
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={styles.messageText}>{msg.text}</p>
                    <div style={styles.messageActions}>
                      <button 
                        onClick={() => deleteMessage(msg._id)}
                        style={styles.deleteButton}
                      >
                        DELETE
                      </button>
                      <button 
                        onClick={() => setSelectedMessage(msg)}
                        style={styles.viewButton}
                      >
                        DETAILS
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={styles.adminSection}>
            <div style={styles.adminHeader}>
              <h2 style={styles.adminTitle}>ADMINISTRATOR ACCOUNTS</h2>
              <button
                onClick={() => setShowAdminForm(true)}
                style={styles.addAdminButton}
              >
                + NEW ADMIN
              </button>
            </div>

            {adminError && (
              <div style={styles.adminError}>
                <span style={styles.errorIcon}>⚠️</span>
                {adminError}
              </div>
            )}

            {showAdminForm && (
              <div style={styles.adminFormContainer}>
                <form onSubmit={handleAdminSubmit} style={styles.adminForm}>
                  <h3 style={styles.formTitle}>
                    {adminForm.editingId ? 'EDIT ADMIN' : 'NEW ADMIN'}
                  </h3>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>USERNAME</label>
                    <input
                      type="text"
                      name="username"
                      value={adminForm.username}
                      onChange={(e) => setAdminForm({...adminForm, username: e.target.value})}
                      style={styles.formInput}
                      required
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>
                      {adminForm.editingId ? 'NEW PASSWORD' : 'PASSWORD'}
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={adminForm.password}
                      onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                      style={styles.formInput}
                      required={!adminForm.editingId}
                    />
                  </div>
                  <div style={styles.formButtons}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAdminForm(false);
                        setAdminForm({ username: '', password: '', editingId: null });
                      }}
                      style={styles.cancelButton}
                    >
                      CANCEL
                    </button>
                    <button type="submit" style={styles.submitButton}>
                      {adminForm.editingId ? 'UPDATE' : 'CREATE'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div style={styles.adminsList}>
              {admins.length === 0 ? (
                <div style={styles.emptyAdmins}>
                  <p>No administrator accounts found</p>
                </div>
              ) : (
                <table style={styles.adminsTable}>
                  <thead>
                    <tr>
                      <th style={styles.tableHeader}>USERNAME</th>
                      <th style={styles.tableHeader}>CREATED</th>
                      <th style={styles.tableHeader}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map(admin => (
                      <tr key={admin._id} style={styles.tableRow}>
                        <td style={styles.tableCell}>{admin.username}</td>
                        <td style={styles.tableCell}>
                          {new Date(admin.createdAt).toLocaleDateString()}
                        </td>
                        <td style={styles.tableCell}>
                          <button
                            onClick={() => {
                              setAdminForm({
                                username: admin.username,
                                password: '',
                                editingId: admin._id
                              });
                              setShowAdminForm(true);
                            }}
                            style={styles.editButton}
                          >
                            EDIT
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(admin._id)}
                            style={styles.deleteAdminButton}
                          >
                            DELETE
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#0a0a1a',
    color: '#e0e0e0',
    fontFamily: "'Courier New', monospace",
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  particleContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    borderRadius: '50%',
    opacity: 0.7,
    filter: 'blur(1px)',
  },
  dashboardContainer: {
    maxWidth: '1300px',
    margin: '50px auto',
    backgroundColor: 'rgba(20, 20, 40, 0.8)',
    borderRadius: '15px',
    padding: '25px',
    boxShadow: '0 0 30px rgba(0, 170, 255, 0.2)',
    border: '1px solid rgba(0, 170, 255, 0.1)',
    backdropFilter: 'blur(5px)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  headerLeft: {
    flex: 1,
    minWidth: '300px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#0af',
    margin: 0,
    letterSpacing: '2px',
    textShadow: '0 0 10px rgba(0, 170, 255, 0.5)',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: '#a0a0a0',
    margin: '5px 0 0 0',
    letterSpacing: '1px',
  },
  searchContainer: {
    position: 'relative',
    minWidth: '250px',
  },
  searchInput: {
    width: '80%',
    padding: '12px 15px 12px 35px',
    backgroundColor: 'rgba(10, 15, 30, 0.7)',
    border: '1px solid rgba(0, 170, 255, 0.3)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: "'Courier New', monospace",
    letterSpacing: '1px',
    transition: 'all 0.3s ease',
  },
  searchIcon: {
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#0af',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 30, 50, 0.2)',
    color: '#f55',
    padding: '12px 20px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 30, 50, 0.5)',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    letterSpacing: '1px',
    transition: 'all 0.3s ease',
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  statCard: {
    backgroundColor: 'rgba(0, 50, 100, 0.2)',
    border: '1px solid rgba(0, 170, 255, 0.2)',
    borderRadius: '10px',
    padding: '15px 25px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '150px',
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#0af',
    marginBottom: '5px',
  },
  statLabel: {
    fontSize: '0.8rem',
    color: '#a0a0a0',
    letterSpacing: '1px',
  },
  filterTabs: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  filterTab: {
    backgroundColor: 'rgba(30, 30, 60, 0.5)',
    color: '#a0a0a0',
    padding: '10px 15px',
    borderRadius: '6px',
    border: '1px solid rgba(0, 170, 255, 0.1)',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    letterSpacing: '1px',
    transition: 'all 0.3s ease',
  },
  activeFilterTab: {
    backgroundColor: 'rgba(0, 100, 200, 0.3)',
    color: '#0af',
    borderColor: 'rgba(0, 170, 255, 0.5)',
    boxShadow: '0 0 10px rgba(0, 170, 255, 0.2)',
  },
  messagesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  messageCard: {
    backgroundColor: 'rgba(30, 30, 60, 0.5)',
    border: '1px solid rgba(0, 170, 255, 0.2)',
    borderRadius: '10px',
    padding: '20px',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
  },
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
    alignItems: 'center',
  },
  messageCategory: {
    backgroundColor: 'rgba(0, 100, 200, 0.3)',
    color: '#0af',
    padding: '3px 10px',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  messageDate: {
    fontSize: '0.7rem',
    color: '#a0a0a0',
  },
  messageText: {
    flex: 1,
    color: '#e0e0e0',
    margin: '10px 0',
    cursor: 'pointer',
    wordBreak: 'break-word',
    lineHeight: '1.5',
  },
  messageActions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '15px',
    gap: '10px',
  },
  deleteButton: {
    backgroundColor: 'rgba(200, 50, 50, 0.2)',
    color: '#f55',
    border: '1px solid rgba(200, 50, 50, 0.5)',
    padding: '8px 15px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    letterSpacing: '1px',
    transition: 'all 0.3s ease',
    flex: 1,
  },
  viewButton: {
    backgroundColor: 'rgba(0, 100, 200, 0.2)',
    color: '#0af',
    border: '1px solid rgba(0, 170, 255, 0.5)',
    padding: '8px 15px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    letterSpacing: '1px',
    transition: 'all 0.3s ease',
    flex: 1,
  },
  loadingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  skeletonCard: {
    backgroundColor: 'rgba(30, 30, 60, 0.5)',
    border: '1px solid rgba(0, 170, 255, 0.1)',
    borderRadius: '10px',
    padding: '20px',
    height: '150px',
  },
  skeletonLine: {
    height: '15px',
    backgroundColor: 'rgba(0, 170, 255, 0.1)',
    borderRadius: '4px',
    marginBottom: '10px',
    animation: 'pulse 1.5s infinite ease-in-out',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '50px 20px',
    backgroundColor: 'rgba(30, 30, 60, 0.3)',
    borderRadius: '10px',
    border: '1px dashed rgba(0, 170, 255, 0.3)',
    marginTop: '20px',
  },
  emptyIcon: {
    fontSize: '3rem',
    color: 'rgba(0, 170, 255, 0.5)',
    marginBottom: '20px',
  },
  emptyText: {
    color: '#a0a0a0',
    fontSize: '1.2rem',
    letterSpacing: '1px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(5px)',
  },
  modalContent: {
    backgroundColor: 'rgba(20, 20, 40, 0.95)',
    border: '1px solid rgba(0, 170, 255, 0.3)',
    borderRadius: '15px',
    padding: '30px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflowY: 'auto',
    position: 'relative',
    boxShadow: '0 0 30px rgba(0, 170, 255, 0.3)',
    animation: 'modalFadeIn 0.3s ease-out',
  },
  closeModal: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#a0a0a0',
    fontSize: '1.5rem',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '1px solid rgba(0, 170, 255, 0.2)',
  },
  modalTitle: {
    color: '#0af',
    margin: 0,
    fontSize: '1.3rem',
    letterSpacing: '1px',
  },
  modalCategory: {
    backgroundColor: 'rgba(0, 100, 200, 0.3)',
    color: '#0af',
    padding: '5px 15px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  modalBody: {
    margin: '20px 0',
  },
  modalText: {
    color: '#e0e0e0',
    lineHeight: '1.6',
    marginBottom: '30px',
  },
  modalMeta: {
    backgroundColor: 'rgba(10, 15, 30, 0.5)',
    borderRadius: '8px',
    padding: '15px',
  },
  metaItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  metaLabel: {
    color: '#a0a0a0',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  metaValue: {
    color: '#e0e0e0',
    fontSize: '0.9rem',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
  },
  modalDeleteButton: {
    backgroundColor: 'rgba(200, 50, 50, 0.2)',
    color: '#f55',
    border: '1px solid rgba(200, 50, 50, 0.5)',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    letterSpacing: '1px',
    transition: 'all 0.3s ease',
  },
  adminSection: {
    marginTop: '20px',
  },
  adminHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  adminTitle: {
    color: '#0af',
    fontSize: '1.2rem',
    margin: 0,
    letterSpacing: '1px',
  },
  addAdminButton: {
    backgroundColor: 'rgba(0, 100, 200, 0.2)',
    color: '#0af',
    border: '1px solid rgba(0, 170, 255, 0.5)',
    padding: '8px 15px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  adminError: {
    backgroundColor: 'rgba(200, 50, 50, 0.2)',
    color: '#f55',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  adminFormContainer: {
    backgroundColor: 'rgba(30, 30, 60, 0.5)',
    border: '1px solid rgba(0, 170, 255, 0.2)',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '20px',
  },
  adminForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formTitle: {
    color: '#0af',
    margin: '0 0 10px 0',
    fontSize: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  formLabel: {
    fontSize: '0.8rem',
    color: '#a0a0a0',
  },
  formInput: {
    padding: '10px',
    backgroundColor: 'rgba(10, 15, 30, 0.7)',
    border: '1px solid rgba(0, 170, 255, 0.3)',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
  },
  formButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '10px',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    color: '#a0a0a0',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  submitButton: {
    backgroundColor: 'rgba(0, 100, 200, 0.3)',
    color: '#0af',
    border: '1px solid rgba(0, 170, 255, 0.5)',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  adminsList: {
    backgroundColor: 'rgba(30, 30, 60, 0.5)',
    border: '1px solid rgba(0, 170, 255, 0.2)',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  emptyAdmins: {
    padding: '20px',
    textAlign: 'center',
    color: '#a0a0a0',
  },
  adminsTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    padding: '12px 15px',
    textAlign: 'left',
    backgroundColor: 'rgba(0, 50, 100, 0.3)',
    color: '#0af',
    fontSize: '0.8rem',
  },
  tableRow: {
    borderBottom: '1px solid rgba(0, 170, 255, 0.1)',
  },
  tableCell: {
    padding: '12px 15px',
    fontSize: '0.9rem',
  },
  editButton: {
    backgroundColor: 'rgba(0, 100, 200, 0.2)',
    color: '#0af',
    border: '1px solid rgba(0, 170, 255, 0.5)',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '5px',
  },
  deleteAdminButton: {
    backgroundColor: 'rgba(200, 50, 50, 0.2)',
    color: '#f55',
    border: '1px solid rgba(200, 50, 50, 0.5)',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  navTabs: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
  },
  navTab: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#a0a0a0',
    padding: '10px 20px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  activeNavTab: {
    color: '#0af',
    borderBottom: '2px solid #0af',
  },
  '@keyframes pulse': {
    '0%, 100%': {
      opacity: 0.6,
    },
    '50%': {
      opacity: 1,
    },
  },
  '@keyframes float': {
    '0%, 100%': {
      transform: 'translateY(0)',
    },
    '50%': {
      transform: 'translateY(-20px)',
    },
  },
  '@keyframes modalFadeIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
};

export default AdminDashboard;