import React from 'react';
import { useRole, ROLES } from '../contexts/RoleContext';
import { Card, CardHeader } from '../components/ui/Card';
import { StatCard } from '../components/dashboard/StatCard';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

export default function Analytics() {
    const { role } = useRole();
    const showFullAnalytics = [ROLES.FOUNDER, ROLES.CO_FOUNDER].includes(role);

    return (
        <div className="flex flex-col gap-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
                <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
                <p className="text-muted">Monitor your startup's health and growth.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <StatCard title="Total Users" value="1,240" trend="+12%" trendUp={true} icon={Users} />
                <StatCard title="MRR" value="$4.2k" trend="+8%" trendUp={true} icon={DollarSign} />
                <StatCard title="Churn Rate" value="2.1%" trend="-0.5%" trendUp={true} icon={Activity} />
            </div>

            {showFullAnalytics ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <Card>
                        <CardHeader title="User Growth (Last 6 Months)" />
                        <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '1rem', paddingTop: '1rem' }}>
                            {[40, 60, 55, 75, 80, 100].map((h, i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                                    <div style={{ width: '100%', height: `${h}%`, background: 'var(--primary)', borderRadius: '4px 4px 0 0', opacity: 0.8 }}></div>
                                    <span className="text-xs text-muted">M{i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <CardHeader title="Revenue Breakdown" />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', height: '100%' }}>
                            {[
                                { label: 'Pro Plan', val: 65, color: '#3B82F6' },
                                { label: 'Enterprise', val: 25, color: '#10B981' },
                                { label: 'Add-ons', val: 10, color: '#F59E0B' }
                            ].map((item) => (
                                <div key={item.label}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                        <span>{item.label}</span>
                                        <span style={{ fontWeight: 600 }}>{item.val}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${item.val}%`, height: '100%', background: item.color }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            ) : (
                <Card>
                    <div className="text-center p-8">
                        <p className="text-muted">Detailed analytics are available to Founders.</p>
                    </div>
                </Card>
            )}
        </div>
    );
}
