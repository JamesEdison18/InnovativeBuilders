import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    CheckSquare,
    MessageSquare,
    Lightbulb,
    BarChart2,
    Settings,
    Users
} from 'lucide-react';
import { useRole, ROLES } from '../../contexts/RoleContext';

export function Sidebar() {
    const { role } = useRole();

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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--border)' }}></div>
                    <div>
                        <p className="text-sm font-semibold">User Name</p>
                        <p className="text-sm text-muted" style={{ fontSize: '0.75rem' }}>{role}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}