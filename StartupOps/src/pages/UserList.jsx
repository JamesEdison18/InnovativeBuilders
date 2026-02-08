import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Loader2, ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserList() {
    const { userProfile } = useAuth();
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]); // New state for tasks
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!userProfile?.startupId) return;

        // 1. Fetch Users
        const qUsers = query(collection(db, 'users'), where('startupId', '==', userProfile.startupId));
        const unsubscribeUsers = onSnapshot(qUsers, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(list);
            setLoading(false); // Set loading false after users load
        });

        // 2. Fetch Tasks (to check busy status)
        const qTasks = query(collection(db, 'tasks'), where('startupId', '==', userProfile.startupId));
        const unsubscribeTasks = onSnapshot(qTasks, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTasks(list);
        });

        return () => {
            unsubscribeUsers();
            unsubscribeTasks();
        };
    }, [userProfile]);

    const filteredUsers = users.filter(user =>
        (user.displayName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Link to="/analytics" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">User Management</h1>
                    <p className="text-muted">Detailed view of your startup's users.</p>
                </div>
            </div>

            <Card>
                <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={16} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-body)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:border-[var(--primary)]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Badge variant="blue">{users.length} Users</Badge>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border)] text-muted text-sm">
                                <th className="p-4 font-medium">User</th>
                                <th className="p-4 font-medium">Role</th>
                                <th className="p-4 font-medium">Subscription</th>
                                <th className="p-4 font-medium">Workload</th>
                                <th className="p-4 font-medium">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="border-b border-[var(--border)] last:border-0 hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="font-semibold">{user.displayName || 'Unknown'}</div>
                                        <div className="text-xs text-muted">{user.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <Badge variant={user.role === 'FOUNDER' ? 'yellow' : user.role === 'MENTOR' ? 'blue' : 'gray'}>
                                            {user.role}
                                        </Badge>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${user.plan === 'Enterprise' ? 'bg-purple-500/20 text-purple-400' :
                                            user.plan === 'Pro' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {user.plan || 'Free'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {(() => {
                                            // Determine Status Logic
                                            let statusLabel = 'Available';
                                            let statusColor = 'green';

                                            // 1. Check if user is "Busy" with tasks
                                            const activeTasks = tasks.filter(t =>
                                                t.assignedTo?.includes(user.id) &&
                                                t.status !== 'Done' &&
                                                t.status !== 'Completed'
                                            );

                                            if (activeTasks.length > 0) {
                                                statusLabel = `Busy (${activeTasks.length})`;
                                                statusColor = 'orange'; // Busy
                                            } else if (user.role === 'FOUNDER' || user.role === 'MENTOR') {
                                                statusLabel = 'Online'; // Founders/Mentors usually just online
                                                statusColor = 'blue';
                                            }

                                            // 2. Override if account is explicitly cancelled (if that data exists)
                                            if (user.status === 'cancelled') {
                                                statusLabel = 'Cancelled';
                                                statusColor = 'red';
                                            }

                                            return (
                                                <span className={`flex items-center gap-1.5 text-sm ${statusColor === 'green' ? 'text-green-400' :
                                                    statusColor === 'orange' ? 'text-orange-400' :
                                                        statusColor === 'red' ? 'text-red-400' :
                                                            'text-blue-400'
                                                    }`}>
                                                    <span className={`w-2 h-2 rounded-full ${statusColor === 'green' ? 'bg-green-400' :
                                                        statusColor === 'orange' ? 'bg-orange-400' :
                                                            statusColor === 'red' ? 'bg-red-400' :
                                                                'bg-blue-400'
                                                        }`} />
                                                    {statusLabel}
                                                </span>
                                            );
                                        })()}
                                    </td>
                                    <td className="p-4 text-sm text-muted">
                                        {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
