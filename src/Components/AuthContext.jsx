import { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create the AuthContext
const AuthContext = createContext();

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user data from API or local storage on initial load
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/hr-management/auth"); // Adjust URL as needed
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });
      setUser(res.data);
    } catch (err) {
      console.error("Error logging in:", err);
    }
  };

  const logout = () => {
    axios
      .post("http://localhost:3000/auth/logout")
      .then(() => setUser(null))
      .catch((err) => console.error("Error logging out:", err));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
