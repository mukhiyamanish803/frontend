// frontend\employara\src\context\AuthContex.jsx
import React, { useContext, useEffect, useRef } from "react";
import authApi from "@/api/authApi";
import publicApi from "@/api/publicApi";
import userApi from "@/api/userApi";
import { Client } from "@stomp/stompjs";
import { toast } from "sonner";

const Context = React.createContext();
const AuthContex = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [dialCodes, setDialCodes] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [jobs, setJobs] = React.useState([]);
  const [company, setCompany] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);
  const [selectedJob, setSelectedJob] = React.useState(null); // New state
  // for selected job

  const [appliedJobs, setAppliedJobs] = React.useState([]);
  const socketRef = useRef(null);
  const connectedRef = useRef(false);

  const getAccessToken = async () => {
    try {
      const response = await authApi.post("/token-for-websocket");
      return response.data;
    } catch (err) {
      console.error("Token refresh failed", err);
      throw err;
    }
  };

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await authApi.get("/me");
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await publicApi.get("/categories");
      setCategories(response.data);
      if (response.data.length > 0) {
      }
    } catch (error) {
      setCategories([]);
    }
  };

  const fetchNotifications = async () => {
    if (!user) return; // Skip if user is not available

    try {
      const response = await publicApi.get("/notification");
      setNotifications(response.data);
    } catch (error) {
    }
  };

  const login = async (userData) => {
    setLoading(true);
    try {
      const response = await authApi.post("/login", userData);
      setIsInitialized(true); // Set initialized after successful login
      await fetchUser(); // Fetch user data after login
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      await authApi.post("/register", userData);
      setIsInitialized(true); // Set initialized after successful signup
      await fetchUser(); // Fetch user data after signup
    } catch (error) {
      throw error; // Re-throw the error to handle it in the component
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    setLoading(true);
    try {
      await authApi.post("/logout");
      setUser(null);
      setIsInitialized(false); // Reset initialized state on logout
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCategories();
    // Remove fetchNotifications() from here
  }, []);

  // Add this effect to fetch notifications when user changes
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    const connectWebSocket = async () => {
      if (connectedRef.current || !user) return;

      try {
        const token = await getAccessToken();

        socketRef.current = new Client({
          brokerURL: "wss://backend-7wlz.onrender.com/ws",
          connectHeaders: {
            Authorization: token,
          },
          
          reconnectDelay: 5000,
          onConnect: (frame) => {
            connectedRef.current = true;

            socketRef.current.subscribe(
              "/user/queue/notifications",
              (message) => {
                const body = JSON.parse(message.body);
                setNotifications((prev) => [body, ...prev]);
              }
            );
          },
          onStompError: (frame) => {
          },
        });

        socketRef.current.activate();
      } catch (err) {
        console.error("❌ WebSocket connection error:", err);
      }
    };

    connectWebSocket();

    return () => {
      if (socketRef.current && socketRef.current.active) {
        socketRef.current.deactivate();
        connectedRef.current = false;
      }
    };
  }, [user]);

  const value = {
    user,
    setUser,
    loading,
    setLoading,
    fetchUser,
    login,
    signup,
    logout,
    dialCodes,
    categories,
    setDialCodes,
    setCategories,
    isInitialized,
    jobs,
    setJobs,
    company,
    setCompany,
    selectedJob, // Include selectedJob in the context value
    setSelectedJob, // Include setSelectedJob in the context value
    notifications,
    setNotifications,
    appliedJobs,
    setAppliedJobs,
    socketRef,
    connectedRef,
    getAccessToken,
    fetchCategories,
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default AuthContex;

export const useAuth = () => useContext(Context);
