import React, { createContext, useContext, useState } from 'react';

const RoleContext = createContext();

export const ROLES = {
    FOUNDER: 'Founder',
    CO_FOUNDER: 'Co-Founder',
    TEAM: 'Team Member',
    MENTOR: 'Mentor',
};

export function RoleProvider({ children }) {
    const [role, setRole] = useState(ROLES.FOUNDER);

    return (
        <RoleContext.Provider value={{ role, setRole }}>
            {children}
        </RoleContext.Provider>
    );
}

export function useRole() {
    return useContext(RoleContext);
}
