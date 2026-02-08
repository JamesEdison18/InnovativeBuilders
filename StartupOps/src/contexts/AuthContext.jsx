import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Sign Up (Base function)
    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    // Login
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    // Logout
    function logout() {
        return signOut(auth);
    }

    // Create User Document (Firestore)
    async function createUserProfile(uid, data) {
        await setDoc(doc(db, 'users', uid), {
            ...data,
            createdAt: new Date()
        });
    }

    // Monitor Auth State
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                // Fetch user profile (role, startupId)
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserProfile({ uid: user.uid, ...docSnap.data() });
                }
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userProfile,
        signup,
        login,
        logout,
        createUserProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
