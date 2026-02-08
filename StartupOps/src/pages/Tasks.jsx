import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRole, ROLES } from '../contexts/RoleContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CheckCircle2, Clock, Calendar, Plus, X, Loader2, User, Flag, BarChart2, CheckSquare, Trash2 } from 'lucide-react';
import { createNotification } from '../lib/notifications';

export default function Tasks() {
    const { userProfile, currentUser } = useAuth();
    const { role } = useRole();
    const isFounder = [ROLES.FOUNDER, ROLES.CO_FOUNDER].includes(role);

    // State
    const [activeTab, setActiveTab] = useState('tasks'); // tasks, milestones, progress
    const [tasks, setTasks] = useState([]);
    const [milestones, setMilestones] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modals
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showMilestoneModal, setShowMilestoneModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // New state for loading

    // Forms
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium', dueDate: '', assignedTo: [] }); // assignedTo = array of UIDs
    const [newMilestone, setNewMilestone] = useState({ title: '', date: '', status: 'Upcoming' });

    useEffect(() => {
        if (!userProfile?.startupId) {
            setLoading(false);
            return;
        }
        const startupId = userProfile.startupId;

        // 1. Fetch Tasks
        const tasksQuery = query(collection(db, 'tasks'), where('startupId', '==', startupId));
        const unsubTasks = onSnapshot(tasksQuery, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Client-side sort: Due date ascending (soonest first), then priority
            list.sort((a, b) => new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31'));
            setTasks(list);
        });

        // 2. Fetch Milestones
        const milestonesQuery = query(collection(db, 'milestones'), where('startupId', '==', startupId));
        const unsubMilestones = onSnapshot(milestonesQuery, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            list.sort((a, b) => new Date(a.date || '9999-12-31') - new Date(b.date || '9999-12-31'));
            setMilestones(list);
        });

        // 3. Fetch Team (for assignment)
        const teamQuery = query(collection(db, 'users'), where('startupId', '==', startupId));
        const unsubTeam = onSnapshot(teamQuery, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTeamMembers(list);
            setLoading(false);
        });

        return () => {
            unsubTasks();
            unsubMilestones();
            unsubTeam();
        };
    }, [userProfile]);

    // --- HANDLERS ---

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!userProfile?.startupId) {
            alert("Error: Missing Startup ID. Please reload.");
            return;
        }

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'tasks'), {
                ...newTask,
                status: 'Pending',
                progress: 0,
                startupId: userProfile.startupId,
                createdBy: currentUser?.uid || userProfile?.uid,
                createdAt: serverTimestamp()
            });

            // NOTIFICATIONS: Send to all assigned users (except self)
            if (newTask.assignedTo && newTask.assignedTo.length > 0) {
                newTask.assignedTo.forEach(uid => {
                    if (uid !== (currentUser?.uid)) {
                        createNotification(
                            uid,
                            'task_assignment',
                            'New Task Assigned',
                            `You have been assigned to: "${newTask.title}"`,
                            '/tasks',
                            userProfile
                        );
                    }
                });
            }

            setShowTaskModal(false);
            setNewTask({ title: '', description: '', priority: 'Medium', dueDate: '', assignedTo: [] });
        } catch (error) {
            console.error("Error creating task:", error);
            alert("Failed to create task: " + error.message);
        }
        setIsSubmitting(false);
    };

    const handleAddMilestone = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'milestones'), {
                ...newMilestone,
                startupId: userProfile.startupId,
                createdBy: userProfile.uid,
                createdAt: serverTimestamp()
            });
            setShowMilestoneModal(false);
            setNewMilestone({ title: '', date: '', status: 'Upcoming' });
        } catch (error) {
            console.error("Error creating milestone:", error);
        }
    };

    const updateTaskProgress = async (taskId, newProgress) => {
        let newStatus = 'In Progress';
        if (newProgress === 100) newStatus = 'Done';
        if (newProgress === 0) newStatus = 'Pending';

        try {
            await updateDoc(doc(db, 'tasks', taskId), {
                progress: newProgress,
                status: newStatus
            });
        } catch (error) {
            console.error("Error updates task:", error);
        }
    };

    const toggleMilestoneStatus = async (ms) => {
        const newStatus = ms.status === 'Completed' ? 'Upcoming' : 'Completed';
        try {
            await updateDoc(doc(db, 'milestones', ms.id), { status: newStatus });
        } catch (error) {
            console.error("Error updating milestone:", error);
        }
    };

    const deleteMilestone = async (id) => {
        if (!window.confirm("Delete this milestone?")) return;
        try {
            await deleteDoc(doc(db, 'milestones', id));
        } catch (error) {
            console.error("Error deleting milestone:", error);
        }
    };

    // --- RENDER HELPERS ---

    const getPriorityColor = (p) => {
        if (p === 'High') return 'red';
        if (p === 'Medium') return 'yellow';
        return 'green';
    };

    const getAssignedNames = (ids) => {
        if (!ids || ids.length === 0) return 'Unassigned';
        return ids.map(id => {
            const member = teamMembers.find(m => m.id === id);
            return member ? (member.displayName || member.email) : 'Unknown';
        }).join(', ');
    };

    // Stats Calculation
    const getMemberStats = (memberId) => {
        const memberTasks = tasks.filter(t => t.assignedTo?.includes(memberId));
        const total = memberTasks.length;
        const completed = memberTasks.filter(t => t.status === 'Done').length;
        const avgProgress = total === 0 ? 0 : memberTasks.reduce((acc, t) => acc + (t.progress || 0), 0) / total;
        return { total, completed, avgProgress };
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="flex flex-col gap-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-2xl font-bold">Tasks & Milestones</h1>
                    <p className="text-muted">Manage roadmap and assignments.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {isFounder && activeTab === 'tasks' && (
                        <Button icon={Plus} onClick={() => setShowTaskModal(true)}>New Task</Button>
                    )}
                    {role === ROLES.FOUNDER && activeTab === 'milestones' && (
                        <Button icon={Plus} onClick={() => setShowMilestoneModal(true)}>New Milestone</Button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)' }}>
                {['tasks', 'milestones', 'progress'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '0.75rem 1rem',
                            borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                            color: activeTab === tab ? 'var(--primary)' : 'var(--text-secondary)',
                            fontWeight: 600,
                            textTransform: 'capitalize'
                        }}
                    >
                        {tab === 'progress' ? 'Team Status' : tab}
                    </button>
                ))}
            </div>

            {/* Content: Tasks */}
            {activeTab === 'tasks' && (
                <div className="grid gap-4">
                    {tasks.length === 0 ? (
                        <div className="text-center p-12 border border-dashed rounded-lg text-muted">No tasks found.</div>
                    ) : (
                        tasks.map(task => (
                            <Card key={task.id} className="p-4">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                            <h3 style={{ fontWeight: 600, textDecoration: task.status === 'Done' ? 'line-through' : 'none', color: task.status === 'Done' ? 'var(--text-secondary)' : 'var(--text-main)' }}>
                                                {task.title}
                                            </h3>
                                            <Badge variant={getPriorityColor(task.priority)}>{task.priority}</Badge>
                                        </div>
                                        <p className="text-sm text-muted mb-2">{task.description}</p>

                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <User size={14} /> {getAssignedNames(task.assignedTo)}
                                            </span>
                                            {task.dueDate && (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <Calendar size={14} /> {task.dueDate}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Progress Control */}
                                    <div style={{ width: '150px', textAlign: 'right' }}>
                                        <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                                            {task.progress || 0}%
                                        </div>
                                        <input
                                            type="range"
                                            min="0" max="100" step="10"
                                            value={task.progress || 0}
                                            onChange={(e) => updateTaskProgress(task.id, parseInt(e.target.value))}
                                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                                            disabled={!isFounder && !task.assignedTo?.includes(userProfile.uid)}
                                        />
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                            {task.status}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {/* Content: Milestones (Horizontal Neon Roadmap) */}
            {activeTab === 'milestones' && (
                <div className="relative py-8 px-4" style={{ overflow: 'hidden' }}>
                    {milestones.length === 0 ? (
                        <div className="text-center py-10 text-muted border border-dashed border-white/10 rounded-xl">
                            <p>No milestones created yet.</p>
                            {role === ROLES.FOUNDER && <p className="text-sm mt-2 text-blue-400">Click "New Milestone" to begin.</p>}
                        </div>
                    ) : (
                        <div className="neon-roadmap-container">
                            <div className="neon-path-line" style={{ width: `${milestones.length * 320}px` }}></div>
                            {milestones.map((ms, index) => {
                                const isCompleted = ms.status === 'Completed';
                                // Determine if active: explicitly 'In Progress' OR it's the first non-completed one
                                const isActive = ms.status === 'In Progress' || (!isCompleted && (index === 0 || milestones[index - 1].status === 'Completed') && ms.status !== 'Pending');
                                // Actually, stick to status if set. If pending, it's upcoming.

                                let statusClass = 'upcoming';
                                if (ms.status === 'Completed') statusClass = 'completed';
                                else if (ms.status === 'In Progress') statusClass = 'active';

                                return (
                                    <div key={ms.id} className="milestone-wrapper">
                                        {/* Node on the line */}
                                        <div
                                            className={`milestone-node ${statusClass}`}
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent opening modal
                                                if (isFounder) toggleMilestoneStatus(ms);
                                            }}
                                            style={{ cursor: isFounder ? 'pointer' : 'default' }}
                                        />

                                        {/* Card below */}
                                        <div
                                            className="milestone-card"
                                            onClick={() => isFounder && handleEditMilestone(ms)}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="milestone-title">{ms.title}</h4>
                                                <span className={`milestone-badge ${statusClass}`}>
                                                    {ms.status}
                                                </span>
                                            </div>

                                            <p className="text-sm text-muted mb-4 line-clamp-2">{ms.description}</p>

                                            {/* Progress Bar */}
                                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginBottom: '1rem', overflow: 'hidden' }}>
                                                <div
                                                    style={{
                                                        height: '100%',
                                                        width: `${ms.progress || 0}%`,
                                                        background: statusClass === 'completed' ? 'var(--success)' : statusClass === 'active' ? '#A855F7' : 'var(--text-secondary)',
                                                        transition: 'width 0.5s ease'
                                                    }}
                                                />
                                            </div>

                                            <div className="milestone-meta">
                                                {ms.date && (
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={12} /> {ms.date}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Actions for Founder */}
                                            {role === ROLES.FOUNDER && (
                                                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); deleteMilestone(ms.id); }}
                                                        style={{
                                                            color: '#ff4d4d',
                                                            filter: 'drop-shadow(0 0 8px rgba(255, 77, 77, 0.8))',
                                                            transition: 'all 0.3s ease',
                                                            background: 'transparent',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            padding: '0.25rem'
                                                        }}
                                                        className="hover:scale-110"
                                                        title="Delete Milestone"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )
            }

            {/* Content: Team Status */}
            {
                activeTab === 'progress' && (
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                        {teamMembers.map(member => {
                            const stats = getMemberStats(member.id);
                            return (
                                <Card key={member.id} className="p-4">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <User size={20} className="text-muted" />
                                        </div>
                                        <div>
                                            <h3 style={{ fontWeight: 600 }}>{member.displayName || member.email}</h3>
                                            <div className="text-sm text-muted">{member.role}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', textAlign: 'center' }}>
                                        <div className="p-2 bg-gray-50 rounded">
                                            <div className="text-lg font-bold">{stats.total}</div>
                                            <div className="text-xs text-muted">Assigned</div>
                                        </div>
                                        <div className="p-2 bg-green-50 rounded text-green-700">
                                            <div className="text-lg font-bold">{stats.completed}</div>
                                            <div className="text-xs">Done</div>
                                        </div>
                                        <div className="p-2 bg-blue-50 rounded text-blue-700">
                                            <div className="text-lg font-bold">{Math.round(stats.avgProgress)}%</div>
                                            <div className="text-xs">Avg Prog</div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )
            }

            {/* MODAL: New Task */}
            {
                showTaskModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                        <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                            <div className="flex justify-between items-start mb-6" style={{ position: 'relative' }}>
                                <h2 className="text-xl font-bold">Create Task</h2>
                                <button
                                    onClick={() => setShowTaskModal(false)}
                                    style={{
                                        position: 'absolute',
                                        right: '-1rem',
                                        top: '-1rem',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '0.5rem'
                                    }}
                                >
                                    <X size={24} color="#EF4444" /> {/* Red-500 */}
                                </button>
                            </div>
                            <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label className="block text-sm font-medium" style={{ marginBottom: '0.5rem', display: 'block' }}>Title</label>
                                    <input
                                        required
                                        placeholder="Task Title"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '4px',
                                            color: 'white',
                                            outline: 'none'
                                        }}
                                        value={newTask.title}
                                        onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium" style={{ marginBottom: '0.5rem', display: 'block' }}>Description</label>
                                    <textarea
                                        placeholder="Add details..."
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '4px',
                                            color: 'white',
                                            outline: 'none',
                                            minHeight: '100px'
                                        }}
                                        value={newTask.description}
                                        onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div>
                                        <label className="block text-sm font-medium" style={{ marginBottom: '0.5rem', display: 'block' }}>Priority</label>
                                        <select
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                background: 'var(--bg-card)', // Use card bg for dropdown legibility
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '4px',
                                                color: 'white',
                                                outline: 'none'
                                            }}
                                            value={newTask.priority}
                                            onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium" style={{ marginBottom: '0.5rem', display: 'block' }}>Due Date</label>
                                        <input
                                            type="date"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '4px',
                                                color: 'white',
                                                outline: 'none',
                                                colorScheme: 'dark' // Ensures calendar icon is light
                                            }}
                                            value={newTask.dueDate}
                                            onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium" style={{ marginBottom: '0.5rem', display: 'block' }}>Assign To</label>
                                    <select
                                        multiple
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '4px',
                                            color: 'white',
                                            outline: 'none',
                                            height: '8rem'
                                        }}
                                        value={newTask.assignedTo}
                                        onChange={e => {
                                            const options = [...e.target.selectedOptions];
                                            const values = options.map(option => option.value);
                                            setNewTask({ ...newTask, assignedTo: values });
                                        }}
                                    >
                                        {teamMembers
                                            .filter(m => {
                                                if (role === ROLES.FOUNDER) return true; // Founders can assign to anyone
                                                if (role === ROLES.CO_FOUNDER) return m.role === ROLES.TEAM || m.id === currentUser?.uid; // Co-Founders: Team only + Self
                                                return false; // Others unlikely to see this, but safe default
                                            })
                                            .map(m => (
                                                <option key={m.id} value={m.id}>{m.displayName || m.email} ({m.role})</option>
                                            ))}
                                    </select>
                                    <p className="text-xs text-muted mt-1">Hold Ctrl/Cmd to select multiple</p>
                                </div>

                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Creating...' : 'Create Task'}
                                </Button>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* MODAL: New Milestone */}
            {
                showMilestoneModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                        <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '400px' }}>
                            <div className="flex justify-between items-start mb-6" style={{ position: 'relative' }}>
                                <h2 className="text-xl font-bold">New Milestone</h2>
                                <button
                                    onClick={() => setShowMilestoneModal(false)}
                                    style={{
                                        position: 'absolute',
                                        right: '-1rem',
                                        top: '-1rem',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '0.5rem'
                                    }}
                                >
                                    <X size={24} color="#EF4444" />
                                </button>
                            </div>
                            <form onSubmit={handleAddMilestone} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label className="block text-sm font-medium" style={{ marginBottom: '0.5rem', display: 'block' }}>Milestone Title</label>
                                    <input
                                        required
                                        placeholder="e.g. MVP Launch"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '4px',
                                            color: 'white',
                                            outline: 'none'
                                        }}
                                        value={newMilestone.title}
                                        onChange={e => setNewMilestone({ ...newMilestone, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium" style={{ marginBottom: '0.5rem', display: 'block' }}>Target Date</label>
                                    <input
                                        required
                                        type="date"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '4px',
                                            color: 'white',
                                            outline: 'none',
                                            colorScheme: 'dark'
                                        }}
                                        value={newMilestone.date}
                                        onChange={e => setNewMilestone({ ...newMilestone, date: e.target.value })}
                                    />
                                </div>
                                <Button type="submit">Create Milestone</Button>
                            </form>
                        </div>
                    </div>
                )
            }

        </div >
    );
}
