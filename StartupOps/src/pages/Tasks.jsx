import React from 'react';
import { useRole, ROLES } from '../contexts/RoleContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function Tasks() {
    const { role } = useRole();
    const canEdit = [ROLES.FOUNDER, ROLES.CO_FOUNDER, ROLES.TEAM].includes(role);

    const tasks = [
        { id: 1, title: 'Finalize Pitch Deck', status: 'In Progress', assignee: 'Founder', priority: 'High' },
        { id: 2, title: 'Integrate Payment Gateway', status: 'Pending', assignee: 'Team Member', priority: 'Medium' },
        { id: 3, title: 'User Interviews (Batch 1)', status: 'Done', assignee: 'Co-Founder', priority: 'High' },
    ];

    const milestones = [
        { id: 1, title: 'MVP Launch', date: 'Feb 28, 2026', status: 'Upcoming' },
        { id: 2, title: 'First 100 Users', date: 'Mar 15, 2026', status: 'Pending' },
    ];

    return (
        <div className="flex flex-col gap-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-2xl font-bold">Tasks & Milestones</h1>
                    <p className="text-muted">Track your execution journey.</p>
                </div>
                {canEdit && <Button icon={Plus}>New Task</Button>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>

                {/* Task List */}
                <Card>
                    <CardHeader title="Active Tasks" action={<Button className="text-sm">Filter</Button>} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {tasks.map(task => (
                            <div key={task.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1rem',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--bg-body)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        border: '2px solid var(--border)',
                                        cursor: canEdit ? 'pointer' : 'default'
                                    }}></div>
                                    <div>
                                        <h4 style={{ fontWeight: 600 }}>{task.title}</h4>
                                        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                            <span>{task.assignee}</span> • <span style={{ color: task.priority === 'High' ? 'var(--danger)' : 'inherit' }}>{task.priority}</span>
                                        </div>
                                    </div>
                                </div>
                                <Badge variant={
                                    task.status === 'Done' ? 'green' :
                                        task.status === 'In Progress' ? 'blue' :
                                            task.status === 'Pending' ? 'yellow' :
                                                'gray'
                                }>
                                    {task.status}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Milestones Timeline */}
                <Card>
                    <CardHeader title="Milestones" />
                    <div style={{ position: 'relative', paddingLeft: '1rem', borderLeft: '2px solid var(--border)' }}>
                        {milestones.map((milestone, index) => (
                            <div key={milestone.id} style={{ marginBottom: '2rem', position: 'relative' }}>
                                <div style={{
                                    position: 'absolute',
                                    left: '-1.45rem',
                                    top: '0.25rem',
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    background: 'var(--primary)',
                                    border: '2px solid white'
                                }}></div>
                                <h4 style={{ fontWeight: 600 }}>{milestone.title}</h4>
                                <p className="text-sm text-muted">{milestone.date}</p>
                                <div style={{ marginTop: '0.5rem' }}>
                                    <Badge variant="gray">{milestone.status}</Badge>
                                </div>
                            </div>
                        ))}
                        {/* Future/Add Milestone */}
                        {canEdit && (
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '-1.45rem', top: '0.25rem', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--border)', border: '2px solid white' }}></div>
                                <Button className="text-sm" style={{ width: '100%' }}>+ Add Milestone</Button>
                            </div>
                        )}
                    </div>
                </Card>

            </div>
        </div>
    );
}
