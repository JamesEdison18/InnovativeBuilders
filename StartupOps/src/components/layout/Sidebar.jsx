import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    CheckSquare,
    MessageSquare,
    Lightbulb,
    BarChart2,
    Settings,
    Users,
    LogOut
} from 'lucide-react';
import { useRole, ROLES } from '../../contexts/RoleContext';
import { useAuth } from '../../contexts/AuthContext';

export function Sidebar() {
    const { role } = useRole();
    const { logout, userProfile } = useAuth();

    const displayName = userProfile?.displayName || 'User Name';
    const rawRole = userProfile?.role || role;
    const displayRole = rawRole === 'TEAM'
        ? 'Team Member'
        : rawRole === 'CO_FOUNDER'
            ? 'Co-Founder'
            : rawRole
                ? rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase().replace('_', '-')
                : 'Guest';

    const menuItems = [
        {
            label: 'Dashboard',
            path: '/dashboard',
            icon: LayoutDashboard,
            roles: [ROLES.FOUNDER, ROLES.CO_FOUNDER, ROLES.TEAM]
        },
        {
            label: 'Overview',
            path: '/overview',
            icon: LayoutDashboard,
            roles: [ROLES.MENTOR]
        },
        {
            label: 'Tasks & Milestones',
            path: '/tasks',
            icon: CheckSquare,
            roles: [ROLES.FOUNDER, ROLES.CO_FOUNDER, ROLES.TEAM]
        },
        {
            label: 'Feedback & Validation',
            path: '/feedback',
            icon: Lightbulb,
            roles: [ROLES.FOUNDER, ROLES.CO_FOUNDER, ROLES.TEAM, ROLES.MENTOR]
        },
        {
            label: 'Analytics',
            path: '/analytics',
            icon: BarChart2,
            roles: [ROLES.FOUNDER, ROLES.CO_FOUNDER, ROLES.MENTOR]
        },
        {
            label: 'Startup Profile',
            path: '/profile',
            icon: Settings,
            roles: [ROLES.FOUNDER, ROLES.CO_FOUNDER]
        },
        {
            label: 'Chats',
            path: '/chats',
            icon: MessageSquare,
            roles: [ROLES.FOUNDER, ROLES.CO_FOUNDER, ROLES.TEAM, ROLES.MENTOR]
        },
    ];

    const filteredItems = menuItems.filter(item => item.roles.includes(role));

    return (
        <aside style={{ width: '250px', background: 'var(--bg-surface)', borderRight: '1px solid var(--border)', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>StartupOps</h2>
                </Link>
            </div>

            <nav style={{ flex: 1, padding: '1rem' }}>
                <ul style={{ listStyle: 'none' }}>
                    {filteredItems.map((item) => (
                        <li key={item.path} style={{ marginBottom: '0.5rem' }}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    isActive ? 'active-link' : 'nav-link'
                                }
                                style={({ isActive }) => ({
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                                    background: isActive ? 'var(--primary-light)' : 'transparent',
                                    fontWeight: isActive ? 600 : 500,
                                    textDecoration: 'none'
                                })}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{displayName.charAt(0)}</span>
                    </div>
                    <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>{displayName}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{displayRole}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem',
                        background: 'transparent',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.background = 'var(--bg-card)'}
                    onMouseOut={(e) => e.target.style.background = 'transparent'}
                >
                    <LogOut size={16} />
                    Log Out
                </button>
            </div>
        </aside>
    );
}