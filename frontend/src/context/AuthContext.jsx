import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const AuthContext = createContext(null);

// Provides authentication state and methods to the entire app tree
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Socket and Notification state
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter(n => !n.read).length;

  // On mount, reads user data from localStorage to persist sessions across refreshes
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Manage Socket connection when user changes
  useEffect(() => {
    if (user) {
      // Connect to the backend
      const newSocket = io('http://localhost:5001');
      setSocket(newSocket);

      newSocket.on('connect', () => {
        // Register this user so backend knows which socket belongs to them
        newSocket.emit('register', user._id || user.id);
      });

      // Listen for incoming dynamic notifications
      newSocket.on('notification', (payload) => {
        setNotifications((prev) => [{ ...payload, read: false }, ...prev]);
      });

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Saves user data to state and localStorage after successful login/register
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Clears user data from state and localStorage on logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setNotifications([]);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, notifications, unreadCount, markAllRead }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context from any component
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
