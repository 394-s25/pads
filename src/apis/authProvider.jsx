import React, { createContext, useState, useContext, useEffect } from "react";
import { handleGoogleLogin, handleGoogleLogout } from "./firebaseAuth";
import { auth } from "../firebaseConfig";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isPADSEmail = (email) => {
    // return (
    //   email.endsWith("@u.northwestern.edu") || // set to northwestern for testing purposes
    //   email.endsWith("@northwestern.edu")
    // );
    return true;
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setAuthUser(firebaseUser);
      if (!firebaseUser) setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      const { uid, name, email } = await handleGoogleLogin();
      if (!isPADSEmail(email)) {
        await logout();
        throw new Error("Please use a PADS email to login");
      }
      return { uid, name, email };
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await handleGoogleLogout();
      setAuthUser(null);
      console.log(authUser);
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        isLoading,
        setIsLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
