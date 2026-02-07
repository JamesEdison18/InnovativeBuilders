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
                <div style={{ position: 'relative' }}>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        style={{
                            appearance: 'none',
                            padding: '0.5rem 2.5rem 0.5rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border)',
                            fontSize: '0.875rem',
                            background: 'var(--bg-body)',
                            color: 'var(--text-main)',
                            cursor: 'pointer',
                            outline: 'none',
                            fontWeight: 500
                        }}
                    >
                        {Object.values(ROLES).map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                    <div style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
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
