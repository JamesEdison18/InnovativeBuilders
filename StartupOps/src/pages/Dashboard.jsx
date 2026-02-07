import React from 'react';
import { useRole, ROLES } from '../contexts/RoleContext';
import { StatCard } from '../components/dashboard/StatCard';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CheckSquare, Users, TrendingUp, DollarSign, ArrowRight } from 'lucide-react';

export default function Dashboard() {
    const { role } = useRole();

    const isFounder = role === ROLES.FOUNDER || role === ROLES.CO_FOUNDER;
    const isTeam = role === ROLES.TEAM;
    const isMentor = role === ROLES.MENTOR;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-2xl font-bold">Welcome back, {role}</h1>
                    <p className="text-muted">Here's what's happening with your startup today.</p>
                </div>
                {isFounder && (
                    <Button>+ New Task</Button>
                )}
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <StatCard title="Active Tasks" value="12" trend="+2" trendUp={true} icon={CheckSquare} />
                {(isFounder || isMentor) && (
                    <>
                        <StatCard title="Team Velocity" value="84%" trend="+5%" trendUp={true} icon={TrendingUp} />
                        <StatCard title="Burn Rate" value="$4.2k" trend="-12%" trendUp={false} icon={DollarSign} />
                    </>
                )}
                <StatCard title="Team Members" value="5" icon={Users} />
            </div>

            {/* Main Content Area */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>

                {/* Left Column: Tasks / Progress */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Card>
                        <CardHeader
                            title={isMentor ? "Milestone Progress" : "Recent Tasks"}
                            subtitle={isMentor ? "Review startup milestones" : "Tasks requiring attention"}
                            action={<Button className="text-sm">View All</Button>}
                        />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: '20px', height: '20px', border: '2px solid var(--border)', borderRadius: '4px' }}></div>
                                        <div>
                                            <p style={{ fontWeight: 500 }}>Update landing page hero section</p>
                                            <p className="text-sm text-muted">Due Tomorrow • Frontend</p>
                                        </div>
                                    </div>
                                    <Badge variant={i === 1 ? 'blue' : i === 2 ? 'yellow' : 'green'}>{i === 1 ? 'In Progress' : i === 2 ? 'Review' : 'Done'}</Badge>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Right Column: Validation / Activity */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Card>
                        <CardHeader title="Recent Feedback" />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>Mentor Name</span>
                                    <span className="text-sm text-muted">2h ago</span>
                                </div>
                                <p className="text-sm text-muted">"Great progress on the MVP. Have you considered..."</p>
                            </div>
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                            <Button style={{ width: '100%' }}>View Feedback</Button>
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
}
