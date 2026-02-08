import React from 'react';
import { useRole, ROLES } from '../../contexts/RoleContext';
import { Bell } from 'lucide-react';

export function Topbar() {
    const { role, setRole } = useRole();

    return (
        <header style={{
            height: '64px',
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem'
        }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Dashboard</h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-body)',
                    border: '1px solid var(--border)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--primary)'
                }}>
                    {role === 'TEAM' ? 'Team Member' :
                        role === 'CO_FOUNDER' ? 'Co-Founder' :
                            role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase().replace('_', '-') : 'Guest'}
                </div>

                <button style={{ position: 'relative', padding: '0.5rem' }}>
                    <Bell size={20} color="var(--text-secondary)" />
                    <span style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        width: '8px',
                        height: '8px',
                        background: 'var(--danger)',
                        borderRadius: '50%'
                    }}></span>
                </button>
            </div>
        </header>
    );
}
