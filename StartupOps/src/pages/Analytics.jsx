import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/dashboard/StatCard';
import { Users, TrendingUp, DollarSign, Activity, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Analytics() {
    const { userProfile } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('monthly'); // 'monthly' or 'yearly'

    useEffect(() => {
        if (!userProfile?.startupId) return;

        const q = query(collection(db, 'users'), where('startupId', '==', userProfile.startupId));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(list);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userProfile]);

    // Metrics Calculations
    const totalUsers = users.length;

    // MRR: Sum of monthly price for all active users
    const mrr = users.reduce((sum, user) => {
        if (user.status !== 'active') return sum;
        const planPrice = user.price || 0;
        const addOnsPrice = (user.addOns || []).reduce((acc, addon) => acc + (addon.price || 0), 0);
        return sum + planPrice + addOnsPrice;
    }, 0);

    // Churn Rate Calculation
    // Logic: (Cancelled this month / Active at start of month) * 100
    // Simplified approximation for this demo: Cancelled users vs Total users
    const cancelledUsers = users.filter(u => u.status === 'cancelled').length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const churnRate = totalUsers > 0 ? ((cancelledUsers / totalUsers) * 100).toFixed(1) : 0;

    // Revenue Breakdown
    const revenueBreakdown = users.reduce((acc, user) => {
        if (user.status !== 'active') return acc;

        if (user.plan === 'Pro') acc.pro += (user.price || 0);
        else if (user.plan === 'Enterprise') acc.enterprise += (user.price || 0);

        const addOns = (user.addOns || []).reduce((s, a) => s + (a.price || 0), 0);
        acc.addOns += addOns;

        return acc;
    }, { pro: 0, enterprise: 0, addOns: 0 });


    // User Growth Graph Logic
    const getGraphData = () => {
        const now = new Date();
        const data = [];

        if (timeRange === 'monthly') {
            // Last 12 months
            for (let i = 11; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const monthLabel = date.toLocaleString('default', { month: 'short' });

                // Count users created in or before this month
                const count = users.filter(u => {
                    const created = u.createdAt?.toDate ? u.createdAt.toDate() : new Date(0);
                    return created <= new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
                }).length;

                data.push({ name: monthLabel, users: count });
            }
        } else {
            // Yearly - last 5 years
            for (let i = 4; i >= 0; i--) {
                const year = now.getFullYear() - i;
                const yearLabel = year.toString();

                // Count users created in or before this year
                const count = users.filter(u => {
                    const created = u.createdAt?.toDate ? u.createdAt.toDate() : new Date(0);
                    return created.getFullYear() <= year;
                }).length;

                data.push({ name: yearLabel, users: count });
            }
        }

        // If no data, return placeholder points for empty graph
        if (data.every(d => d.users === 0)) {
            return data.map(d => ({ ...d, users: 0 }));
        }

        return data;
    };

    const graphData = getGraphData();

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold">Analytics Dashboard (New Layout)</h1>
                <p className="text-muted">Real-time insights into your startup's performance.</p>
            </div>

            {/* Top Stats */}
            {/* Top Stats - Forced Horizontal with Scroll */}
            {/* Top Stats - Forced Horizontal with Scroll */}
            {/* Top Stats - Auto-Fit Grid (Matches Dashboard) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <Link to="/analytics/users" className="block transition-transform hover:scale-[1.02]">
                    <StatCard
                        title="Total Users"
                        value={totalUsers}
                        icon={Users}
                        trend={users.length > 0 ? "+12%" : "0%"}
                        positive={true}
                    />
                </Link>
                <StatCard
                    title="Monthly Recurring Revenue"
                    value={`$${mrr.toLocaleString()}`}
                    icon={DollarSign}
                    trend="+8.2%"
                    positive={true}
                />
                <StatCard
                    title="Churn Rate"
                    value={`${churnRate}%`}
                    icon={Activity}
                    trend="-1.5%"
                    positive={true}
                />
                <StatCard
                    title="Active Users"
                    value={activeUsers}
                    icon={TrendingUp}
                    trend="+5%"
                    positive={true}
                />
            </div>

            {/* User Growth Graph */}
            {/* User Growth Graph - Forced Horizontal */}
            {/* User Growth Graph - Forced Horizontal */}
            {/* User Growth Graph - Responsive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Users</p>
                            <h3 className="text-lg font-semibold">User Growth</h3>
                        </div>
                        {/* Monthly/Yearly Toggle */}
                        <div style={{
                            display: 'flex',
                            background: 'var(--bg-body)',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '1px solid var(--border)'
                        }}>
                            <button
                                onClick={() => setTimeRange('monthly')}
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    background: timeRange === 'monthly' ? 'transparent' : 'var(--bg-surface)',
                                    color: timeRange === 'monthly' ? 'var(--text-main)' : 'var(--text-secondary)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setTimeRange('yearly')}
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    background: timeRange === 'yearly' ? 'var(--primary)' : 'transparent',
                                    color: timeRange === 'yearly' ? 'white' : 'var(--text-secondary)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Yearly
                            </button>
                        </div>
                    </div>
                    <div className="h-[400px] w-full min-h-[400px]" style={{ height: 400, width: '100%' }}>
                        {graphData && graphData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">

                                <AreaChart data={graphData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorUsersGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        dx={-10}
                                        allowDecimals={false}
                                        domain={[0, 'auto']}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                            borderColor: '#3b82f6',
                                            color: '#f8fafc',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
                                        }}
                                        itemStyle={{ color: '#60a5fa' }}
                                        cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="users"
                                        stroke="#ffffff"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorUsersGradient)"
                                        animationDuration={1500}
                                    />
                                </AreaChart>

                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted">
                                No data available for this time range.
                            </div>
                        )}
                    </div>
                </Card>

                {/* Revenue Breakdown */}
                <Card className="p-6" style={{ minWidth: 0, padding: '1.5rem' }}>
                    <h3 className="text-lg font-semibold mb-6" style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>Revenue Breakdown</h3>
                    <div className="space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Pro Plan */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                <span className="text-muted" style={{ color: 'var(--text-secondary)' }}>Pro Plan</span>
                                <span className="font-semibold" style={{ fontWeight: 600 }}>{mrr > 0 ? ((revenueBreakdown.pro / mrr) * 100).toFixed(0) : 0}%</span>
                            </div>
                            <div style={{ height: '6px', background: 'var(--border)', borderRadius: '9999px', overflow: 'hidden' }}>
                                <div
                                    style={{
                                        height: '100%',
                                        background: '#3b82f6', // blue-500
                                        borderRadius: '9999px',
                                        width: `${mrr > 0 ? (revenueBreakdown.pro / mrr) * 100 : 0}%`
                                    }}
                                />
                            </div>
                        </div>

                        {/* Enterprise */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                <span className="text-muted" style={{ color: 'var(--text-secondary)' }}>Enterprise</span>
                                <span className="font-semibold" style={{ fontWeight: 600 }}>{mrr > 0 ? ((revenueBreakdown.enterprise / mrr) * 100).toFixed(0) : 0}%</span>
                            </div>
                            <div style={{ height: '6px', background: 'var(--border)', borderRadius: '9999px', overflow: 'hidden' }}>
                                <div
                                    style={{
                                        height: '100%',
                                        background: '#10b981', // emerald-500
                                        borderRadius: '9999px',
                                        width: `${mrr > 0 ? (revenueBreakdown.enterprise / mrr) * 100 : 0}%`
                                    }}
                                />
                            </div>
                        </div>

                        {/* Add-ons */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                <span className="text-muted" style={{ color: 'var(--text-secondary)' }}>Add-ons</span>
                                <span className="font-semibold" style={{ fontWeight: 600 }}>{mrr > 0 ? ((revenueBreakdown.addOns / mrr) * 100).toFixed(0) : 0}%</span>
                            </div>
                            <div style={{ height: '6px', background: 'var(--border)', borderRadius: '9999px', overflow: 'hidden' }}>
                                <div
                                    style={{
                                        height: '100%',
                                        background: '#f97316', // orange-500
                                        borderRadius: '9999px',
                                        width: `${mrr > 0 ? (revenueBreakdown.addOns / mrr) * 100 : 0}%`
                                    }}
                                />
                            </div>
                        </div>


                    </div>
                </Card>
            </div>
        </div>
    );
}
