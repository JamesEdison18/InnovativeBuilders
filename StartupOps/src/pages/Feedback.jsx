import React, { useState } from 'react';
import { useRole, ROLES } from '../contexts/RoleContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { MessageSquare, ThumbsUp, ThumbsDown, User, ExternalLink } from 'lucide-react';

export default function Feedback() {
    const { role } = useRole();
    const [activeTab, setActiveTab] = useState('internal'); // internal, external

    const isInternal = activeTab === 'internal';

    const feedbackData = [
        { id: 1, type: 'internal', author: 'Mentor (Sarah)', content: 'The user onboarding flow feels a bit disconnected. Consider adding a progress bar.', date: '2 days ago', status: 'Open' },
        { id: 2, type: 'external', author: 'Beta User #42', content: 'Love the clean design! But I couldn\'t find the export button easily.', date: '1 day ago', status: 'Addressed' },
        { id: 3, type: 'internal', author: 'Co-Founder', content: 'We need to validate the pricing model before the next sprint.', date: '3 days ago', status: 'In Progress' },
    ];

    const filteredFeedback = feedbackData.filter(f => f.type === activeTab);

    return (
        <div className="flex flex-col gap-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-2xl font-bold">Feedback & Validation</h1>
                    <p className="text-muted">Validate ideas and gather insights.</p>
                </div>
                <Button>+ New Insight</Button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)' }}>
                <button
                    className={activeTab === 'internal' ? 'active-tab' : ''}
                    style={{
                        padding: '0.75rem 1rem',
                        borderBottom: activeTab === 'internal' ? '2px solid var(--primary)' : '2px solid transparent',
                        color: activeTab === 'internal' ? 'var(--primary)' : 'var(--text-secondary)',
                        fontWeight: 500
                    }}
                    onClick={() => setActiveTab('internal')}
                >
                    Internal & Mentor
                </button>
                <button
                    className={activeTab === 'external' ? 'active-tab' : ''}
                    style={{
                        padding: '0.75rem 1rem',
                        borderBottom: activeTab === 'external' ? '2px solid var(--primary)' : '2px solid transparent',
                        color: activeTab === 'external' ? 'var(--primary)' : 'var(--text-secondary)',
                        fontWeight: 500
                    }}
                    onClick={() => setActiveTab('external')}
                >
                    External Validation
                </button>
            </div>

            {/* Feedback List */}
            <div style={{ display: 'grid', gap: '1rem' }}>
                {filteredFeedback.map(item => (
                    <Card key={item.id}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ padding: '0.5rem', background: 'var(--bg-body)', borderRadius: '50%', height: 'fit-content' }}>
                                <User size={24} color="var(--text-secondary)" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <h4 style={{ fontWeight: 600 }}>{item.author}</h4>
                                    <span className="text-sm text-muted">{item.date}</span>
                                </div>
                                <p style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>{item.content}</p>

                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <Badge variant={item.status === 'Open' ? 'yellow' : item.status === 'In Progress' ? 'blue' : 'green'}>{item.status}</Badge>
                                    <Button style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}>Reply</Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Validation Concept (Example) */}
            <div style={{ marginTop: '2rem' }}>
                <h3 className="section-title" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Active Validation Experiments</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <Card>
                        <CardHeader title="Pricing Tier A/B Test" />
                        <p className="text-sm text-muted" style={{ marginBottom: '1rem' }}>Testing willingness to pay for the 'Pro' tier at $29 vs $49.</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>24%</span>
                                <span className="text-sm text-muted ml-2">Conversion</span>
                            </div>
                            <Badge variant="blue">Running</Badge>
                        </div>
                    </Card>
                    <Card>
                        <CardHeader title="Feature: Dark Mode" />
                        <p className="text-sm text-muted" style={{ marginBottom: '1rem' }}>Survey results from 50 beta users.</p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <ThumbsUp size={16} color="var(--success)" /> <span style={{ fontWeight: 600 }}>42</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <ThumbsDown size={16} color="var(--danger)" /> <span style={{ fontWeight: 600 }}>8</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

        </div>
    );
}
