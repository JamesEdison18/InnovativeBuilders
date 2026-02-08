import React from 'react';
import { useRole, ROLES } from '../../contexts/RoleContext';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, orderBy, limit, writeBatch } from 'firebase/firestore';
import { Bell, Check } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export function Topbar() {
    const { role, setRole } = useRole();
    const { currentUser } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;
    const notificationRef = useRef(null);

    // Fetch Notifications
    useEffect(() => {
        if (!currentUser?.uid) return;

        const q = query(
            collection(db, 'notifications'),
            where('recipientId', '==', currentUser.uid),
            orderBy('createdAt', 'desc'),
            limit(20)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe();
    }, [currentUser]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id) => {
        // Optimistic Update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        try {
            await updateDoc(doc(db, 'notifications', id), { read: true });
        } catch (error) {
            console.error("Error marking read:", error);
        }
    };

    const markAllRead = async () => {
        const unread = notifications.filter(n => !n.read);
        if (unread.length === 0) return;

        // Optimistic Update
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));

        const batch = writeBatch(db);
        unread.forEach(n => {
            const ref = doc(db, 'notifications', n.id);
            batch.update(ref, { read: true });
        });

        try {
            await batch.commit();
        } catch (error) {
            console.error("Error marking all read:", error);
        }
    };

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

                <div style={{ position: 'relative' }} ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        style={{ position: 'relative', padding: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                        <Bell size={20} color="var(--text-secondary)" />
                        {unreadCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                width: '16px',
                                height: '16px',
                                background: 'var(--danger)',
                                borderRadius: '50%',
                                fontSize: '10px',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div style={{
                            position: 'absolute',
                            top: '120%',
                            right: 0,
                            width: '320px',
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            zIndex: 50,
                            maxHeight: '400px',
                            overflowY: 'auto'
                        }}>
                            <div className="p-3 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-body)]">
                                <h3 className="font-semibold text-sm">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent closing
                                            markAllRead();
                                        }}
                                        className="text-xs font-medium hover:underline"
                                        style={{ color: '#60A5FA', cursor: 'pointer', background: 'transparent', border: 'none' }} // blue-400
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-col">
                                {notifications.length === 0 ? (
                                    <div className="p-4 text-center text-sm text-muted">No notifications</div>
                                ) : (
                                    notifications.map(n => (
                                        <div
                                            key={n.id}
                                            onClick={() => !n.read && markAsRead(n.id)}
                                            style={{
                                                padding: '0.75rem',
                                                borderBottom: '1px solid var(--border)',
                                                background: n.read ? 'transparent' : 'rgba(59, 130, 246, 0.05)',
                                                cursor: 'pointer',
                                                transition: 'background 0.2s',
                                                textAlign: 'left' // Ensure text aligns left in flex container
                                            }}
                                            className="hover:bg-[var(--bg-body)]"
                                        >
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium leading-none mb-1">{n.title}</p>
                                                    <p className="text-xs text-muted leading-snug">{n.message}</p>
                                                    <p className="text-[10px] text-muted mt-1 opacity-70">
                                                        {n.createdAt?.seconds ? new Date(n.createdAt.seconds * 1000).toLocaleString() : 'Just now'}
                                                    </p>
                                                </div>
                                                {!n.read && <div className="w-2 h-2 rounded-full bg-[var(--primary)] mt-1"></div>}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
