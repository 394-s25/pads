import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth, database } from "../firebaseConfig";

// check login for nu email
export const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    const user = result.user;

    const isPADSEmail = (email) => {
      // return (
      //   email.endsWith("@u.northwestern.edu") || // set to northwestern for testing purposes
      //   email.endsWith("@northwestern.edu")
      // );
      return true;
    };

    if (!isPADSEmail(user.email)) {
      alert("Please use your PADS email to sign in.");
      await signOut(auth);
      console.error("Not a PADS email");
      return null;
    }
    return {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// sign out user
export const handleGoogleLogout = async () => {
  try {
    await signOut(auth);
    return;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};
