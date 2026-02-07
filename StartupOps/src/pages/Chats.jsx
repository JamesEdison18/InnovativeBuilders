import React, { useState } from 'react';
import { useRole, ROLES } from '../contexts/RoleContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Send, User, Lock } from 'lucide-react';

export default function Chats() {
    const { role } = useRole();
    const [channel, setChannel] = useState('common'); // common, mentor

    const canAccessMentorChat = [ROLES.FOUNDER, ROLES.CO_FOUNDER, ROLES.MENTOR].includes(role);

    // Mock Messages
    const commonMessages = [
        { id: 1, author: 'Founder', role: ROLES.FOUNDER, text: 'Hey team, let\'s sync on the roadmap at 3 PM.', time: '10:30 AM' },
        { id: 2, author: 'Team Member', role: ROLES.TEAM, text: 'Sure, I will have the updates ready.', time: '10:32 AM' },
        { id: 3, author: 'Mentor (Sarah)', role: ROLES.MENTOR, text: 'Great focus on execution. Keep pushing!', time: '11:00 AM' },
    ];

    const mentorMessages = [
        { id: 1, author: 'Founder', role: ROLES.FOUNDER, text: 'Sarah, we are struggling with user retention.', time: 'Yesterday' },
        { id: 2, author: 'Mentor (Sarah)', role: ROLES.MENTOR, text: 'Let\'s review your onboarding funnel. Often the drop-off is there.', time: 'Yesterday' },
    ];

    const messages = channel === 'common' ? commonMessages : mentorMessages;

    return (
        <div className="flex flex-col gap-6" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1 className="text-2xl font-bold">Team Chat</h1>
            </div>

            <div style={{ displah: 'flex', height: '100%', gap: '1.5rem' }}>

                {/* Sidebar / Channel List */}
                <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                        onClick={() => setChannel('common')}
                        style={{
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-md)',
                            background: channel === 'common' ? 'var(--bg-surface)' : 'transparent',
                            border: channel === 'common' ? '1px solid var(--border)' : 'none',
                            textAlign: 'left',
                            fontWeight: 600,
                            color: channel === 'common' ? 'var(--primary)' : 'inherit'
                        }}
                    >
                        # General
                    </button>

                    {canAccessMentorChat && (
                        <button
                            onClick={() => setChannel('mentor')}
                            style={{
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                background: channel === 'mentor' ? 'var(--bg-surface)' : 'transparent',
                                border: channel === 'mentor' ? '1px solid var(--border)' : 'none',
                                textAlign: 'left',
                                fontWeight: 600,
                                color: channel === 'mentor' ? 'var(--primary)' : 'inherit',
                                display: 'flex', alignItems: 'center', gap: '0.5rem'
                            }}
                        >
                            <Lock size={16} /> Mentor Private
                        </button>
                    )}
                </div>

                {/* Chat Area */}
                <Card className="flex flex-col" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                    {/* Header */}
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', background: '#F8FAFC' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                            {channel === 'common' ? '# General' : 'Mentor Private Chat'}
                        </h3>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {messages.map(msg => {
                            const isMe = msg.role === role; // visual check
                            const isMentor = msg.role === ROLES.MENTOR;

                            return (
                                <div key={msg.id} style={{
                                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                                    maxWidth: '70%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: isMe ? 'flex-end' : 'flex-start'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{msg.author}</span>
                                        {isMentor && <Badge variant="blue">Mentor</Badge>}
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{msg.time}</span>
                                    </div>
                                    <div style={{
                                        padding: '0.75rem 1rem',
                                        background: isMe ? 'var(--primary)' : isMentor ? '#EFF6FF' : '#F1F5F9',
                                        color: isMe ? 'white' : 'var(--text-main)',
                                        borderRadius: isMe ? '12px 12px 0 12px' : '12px 12px 12px 0',
                                        border: isMentor && !isMe ? '1px solid #BFDBFE' : 'none'
                                    }}>
                                        {msg.text}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Input */}
                    <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '1rem' }}>
                        <input
                            type="text"
                            placeholder="Type your message..."
                            style={{
                                flex: 1,
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid #CBD5E1',
                                outline: 'none'
                            }}
                        />
                        <Button icon={Send}>Send</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
