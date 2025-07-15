// src/components/auth/AuthProvider.tsx
'use client';

import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This is the key part: onAuthStateChanged is a Firebase listener that
    // triggers whenever the user's sign-in state changes.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // If the user object exists, they are signed in. If it's null, they're signed out.
      setUser(user);
      // We set loading to false once we've checked the auth state.
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const value = { user, isLoading };

  // While we're first checking for the user's status, you could show a global loader,
  // but for this implementation, we will handle loading state inside the components that use the hook.
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
