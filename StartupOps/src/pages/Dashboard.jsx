import React, { useState, useEffect } from 'react';
import { useRole, ROLES } from '../contexts/RoleContext';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, limit, onSnapshot } from 'firebase/firestore';
import { StatCard } from '../components/dashboard/StatCard';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CheckSquare, Users, TrendingUp, DollarSign, ArrowRight, Loader2, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const { role } = useRole();
    const { userProfile } = useAuth();
    const [loading, setLoading] = useState(true);

    // Stats State
    const [stats, setStats] = useState({
        activeTasks: 0,
        teamMembers: 0,
        feedbackCount: 0
    });
    const [recentTasks, setRecentTasks] = useState([]);
    const [recentFeedback, setRecentFeedback] = useState([]);

    const isFounder = role === ROLES.FOUNDER || role === ROLES.CO_FOUNDER;
    const isTeam = role === ROLES.TEAM;
    const isMentor = role === ROLES.MENTOR;

    useEffect(() => {
        if (!userProfile?.startupId) {
            setLoading(false);
            return;
        }

        const startupId = userProfile.startupId;

        // 1. Tasks Listener (Counts & Recent)
        // Removed orderBy to avoid missing index issues. Sorting client-side.
        const tasksQuery = query(collection(db, 'tasks'), where('startupId', '==', startupId));
        const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
            const allTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Client-side sort
            allTasks.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

            const pending = allTasks.filter(t => t.status !== 'Done').length;
            setStats(prev => ({ ...prev, activeTasks: pending }));
            setRecentTasks(allTasks.slice(0, 5)); // Top 5 recent
        });

        // 2. Team Listener
        const teamQuery = query(collection(db, 'users'), where('startupId', '==', startupId));
        const unsubscribeTeam = onSnapshot(teamQuery, (snapshot) => {
            console.log("DASHBOARD TEAM DEBUG:", {
                currentUser: userProfile.email,
                role: role,
                myStartupId: startupId,
                count: snapshot.size,
                members: snapshot.docs.map(d => ({ id: d.id, email: d.data().email, name: d.data().displayName, role: d.data().role }))
            });
            setStats(prev => ({ ...prev, teamMembers: snapshot.size }));
        });

        // 3. Feedback Listener
        const feedbackQuery = query(collection(db, 'feedback'), where('startupId', '==', startupId));
        const unsubscribeFeedback = onSnapshot(feedbackQuery, (snapshot) => {
            const feedbackList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Client-side sort
            feedbackList.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

            setRecentFeedback(feedbackList.slice(0, 3));
            setLoading(false);
        }, (error) => {
            console.log("Feedback fetch error:", error);
            setLoading(false);
        });

        return () => {
            unsubscribeTasks();
            unsubscribeTeam();
            unsubscribeFeedback();
        };
    }, [userProfile]);

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-2xl font-bold">Welcome back, {userProfile?.displayName || role}</h1>
                    <p className="text-muted">Here's what's happening with your startup today.</p>
                </div>
                {isFounder && (
                    <Link to="/tasks"><Button>Manage Tasks</Button></Link>
                )}
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <StatCard title="Active Tasks" value={stats.activeTasks} trend="Live" trendUp={true} icon={CheckSquare} />
                <StatCard title="Team Members" value={stats.teamMembers} icon={Users} />
                <StatCard title="Recent Feedback" value={recentFeedback.length} icon={MessageSquare} />

                {(isFounder) && (
                    <StatCard title="Runway" value="--" trend="Connect Bank" trendUp={false} icon={DollarSign} />
                )}
            </div>

            {/* Main Content Area */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

                {/* Left Column: Tasks / Progress */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Card>
                        <CardHeader
                            title="Recent Tasks"
                            subtitle="Latest activity on your roadmap"
                            action={<Link to="/tasks"><Button className="text-sm" variant="ghost">View All</Button></Link>}
                        />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {recentTasks.length === 0 ? (
                                <p className="text-muted text-sm p-4">No tasks yet.</p>
                            ) : (
                                recentTasks.map(task => (
                                    <div key={task.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={
                                                { width: '12px', height: '12px', borderRadius: '50%', background: task.priority === 'High' ? 'red' : task.priority === 'Medium' ? 'orange' : 'green' }
                                            }></div>
                                            <div>
                                                <p style={{ fontWeight: 500 }}>{task.title}</p>
                                                <p className="text-sm text-muted">{task.status} • {task.priority}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                {/* Right Column: Feedback */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Card>
                        <CardHeader title="Incoming Feedback" />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {recentFeedback.length === 0 ? (
                                <div className="p-8 text-center border border-dashed rounded-lg">
                                    <p className="text-muted">No feedback yet.</p>
                                </div>
                            ) : (
                                recentFeedback.map(fb => (
                                    <div key={fb.id} style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                            <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{fb.authorName || 'Mentor'}</span>
                                            <span className="text-sm text-muted">Recent</span>
                                        </div>
                                        <p className="text-sm text-muted">"{fb.content}"</p>
                                    </div>
                                ))
                            )}
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                            {/* Link to Feedback page if it exists later */}
                            <Button style={{ width: '100%' }} variant="ghost">View All Feedback</Button>
                        </div>
                    </Card>
                </div>

            </div>

            {/* DEBUG INFO - REMOVE BEFORE PRODUCTION */}
            <div className="p-4 bg-gray-100 rounded text-xs font-mono border overflow-auto">
                <p><strong>DEBUG INFO:</strong></p>
                <p>My UID: {userProfile?.uid}</p>
                <p>My StartupID: {userProfile?.startupId}</p>
                <p>Team Count From Query: {stats.teamMembers}</p>
                <p>Recent Tasks: {recentTasks.length}</p>
            </div>
        </div>
    );
}
