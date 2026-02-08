import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const RoleContext = createContext();

export const ROLES = {
    FOUNDER: 'FOUNDER',
    CO_FOUNDER: 'CO_FOUNDER',
    TEAM: 'TEAM',
    MENTOR: 'MENTOR',
};

export function RoleProvider({ children }) {
    const { userProfile } = useAuth();
    const [role, setRole] = useState(null);

    useEffect(() => {
        if (userProfile?.role) {
            setRole(userProfile.role);
        } else {
            setRole(null);
        }
    }, [userProfile]);

    const value = {
        role,
        user: userProfile || { name: 'Guest' }, // Fallback for safe access
    };

    return (
        <RoleContext.Provider value={value}>
            {children}
        </RoleContext.Provider>
    );
}

export function useRole() {
    return useContext(RoleContext);
}
