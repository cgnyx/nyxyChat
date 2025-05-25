
"use client";

import type { User as FirebaseUser } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { UserProfile } from "@/types";
import { auth, db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        setCurrentUser(user);
        if (user) {
          try {
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              setUserProfile(userDocSnap.data() as UserProfile);
            } else {
              // This case might happen if user record in Firestore is deleted
              // or not yet created after social sign-up.
              // For a robust app, you might want to create it here or handle this scenario.
              setUserProfile(null); 
              console.warn("User profile not found in Firestore for UID:", user.uid);
            }
          } catch (e) {
            console.error("Error fetching user profile:", e);
            setError(e instanceof Error ? e : new Error(String(e)));
            setUserProfile(null);
          }
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Auth state change error:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
