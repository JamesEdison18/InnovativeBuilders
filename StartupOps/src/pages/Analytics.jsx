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
    const [timeRange, setTimeRange] = useState('6M'); // 1M, 6M, 1Y

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
    // User Growth Graph Logic
    const getGraphData = () => {
        const now = new Date();
        const data = [];

        if (timeRange === '1M') {
            // Daily granularity for 1 Month
            for (let i = 30; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                const label = date.toLocaleString('default', { month: 'short', day: 'numeric' });

                // Count total users created ON or BEFORE this specific day
                const count = users.filter(u => {
                    const created = u.createdAt?.toDate ? u.createdAt.toDate() : new Date(0);
                    // Set both to end of day for comparison
                    const comparisonDate = new Date(date);
                    comparisonDate.setHours(23, 59, 59, 999);
                    return created <= comparisonDate;
                }).length;

                data.push({ name: label, users: count });
            }
        } else {
            // Monthly granularity for 6M/1Y
            const months = timeRange === '6M' ? 6 : 12;
            for (let i = months - 1; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const monthLabel = date.toLocaleString('default', { month: 'short' });

                // Count users created in or before this month
                const count = users.filter(u => {
                    const created = u.createdAt?.toDate ? u.createdAt.toDate() : new Date(0);
                    return created <= new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
                }).length;

                data.push({ name: monthLabel, users: count });
            }
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
                        <h3 className="text-lg font-semibold">User Growth</h3>

                    </div>
                    <div className="h-[400px] w-full min-h-[400px]">
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
                    </div>
                </Card>

                {/* Revenue Breakdown */}
                <Card className="p-6" style={{ minWidth: 0 }}>
                    <h3 className="text-lg font-semibold mb-6">Revenue Breakdown</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-muted">Pro Plan</span>
                                <span className="font-semibold">${revenueBreakdown.pro.toLocaleString()}</span>
                            </div>
                            <div className="h-2 bg-[var(--bg-body)] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 rounded-full"
                                    style={{ width: `${mrr > 0 ? (revenueBreakdown.pro / mrr) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-muted">Enterprise</span>
                                <span className="font-semibold">${revenueBreakdown.enterprise.toLocaleString()}</span>
                            </div>
                            <div className="h-2 bg-[var(--bg-body)] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-purple-500 rounded-full"
                                    style={{ width: `${mrr > 0 ? (revenueBreakdown.enterprise / mrr) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-muted">Add-ons</span>
                                <span className="font-semibold">${revenueBreakdown.addOns.toLocaleString()}</span>
                            </div>
                            <div className="h-2 bg-[var(--bg-body)] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500 rounded-full"
                                    style={{ width: `${mrr > 0 ? (revenueBreakdown.addOns / mrr) * 100 : 0}%` }}
                                />
                            </div>
                        </div>

                        <div className="pt-6 mt-6 border-t border-[var(--border)]">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-sm text-muted">Total MRR</p>
                                    <p className="text-2xl font-bold text-[var(--primary)]">${mrr.toLocaleString()}</p>
                                </div>
                                <div className="p-2 bg-[var(--primary-light)] rounded-lg text-[var(--primary)]">
                                    <DollarSign size={20} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
