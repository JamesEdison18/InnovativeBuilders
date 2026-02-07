import React from 'react';
import { Card } from '../ui/Card';

export function StatCard({ title, value, trend, icon: Icon, trendUp }) {
    return (
        <Card className="flex flex-col gap-2">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <p className="text-sm text-muted">{title}</p>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.25rem' }}>{value}</h3>
                </div>
                {Icon && <div style={{ padding: '0.5rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}><Icon size={20} /></div>}
            </div>
            {trend && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    <span style={{ color: trendUp ? 'var(--success)' : 'var(--danger)', fontWeight: 500 }}>
                        {trend}
                    </span>
                    <span className="text-muted">vs last month</span>
                </div>
            )}
        </Card>
    );
}
