import React, { useState } from 'react';
import { useRole, ROLES } from '../contexts/RoleContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Building, Globe, MapPin, Mail, Edit2 } from 'lucide-react';

export default function Profile() {
    const { role } = useRole();
    const canEdit = [ROLES.FOUNDER, ROLES.CO_FOUNDER].includes(role);
    const [isEditing, setIsEditing] = useState(false);

    // Mock Data
    const [startup, setStartup] = useState({
        name: 'StartupOps',
        tagline: 'Digital Infrastructure for Early-Stage Founders',
        stage: 'Seed Stage',
        website: 'https://startupops.io',
        location: 'San Francisco, CA',
        description: 'StartupOps connects operational tools into a single workflow for founders.'
    });

    return (
        <div className="flex flex-col gap-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-2xl font-bold">Startup Profile</h1>
                    <p className="text-muted">Manage your startup's public information.</p>
                </div>
                {canEdit && (
                    <Button icon={Edit2} onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                )}
            </div>

            <Card>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                    {/* Logo Placeholder */}
                    <div style={{ width: '100px', height: '100px', borderRadius: 'var(--radius-lg)', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>
                        S
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{startup.name}</h2>
                            <p className="text-muted">{startup.tagline}</p>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Badge variant="blue">{startup.stage}</Badge>
                            <Badge variant="gray">12 Employees</Badge>
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.5rem 0' }} />

                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                                <Globe size={18} />
                                <span>{startup.website}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                                <MapPin size={18} />
                                <span>{startup.location}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <Card>
                <CardHeader title="About" />
                <p style={{ lineHeight: 1.6 }}>{startup.description}</p>
            </Card>

            <Card>
                <CardHeader title="Founder Team" />
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', flex: 1 }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#E2E8F0' }}></div>
                        <div>
                            <p style={{ fontWeight: 600 }}>Alex Founder</p>
                            <p className="text-sm text-muted">CEO</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', flex: 1 }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#E2E8F0' }}></div>
                        <div>
                            <p style={{ fontWeight: 600 }}>Jamie Co-Founder</p>
                            <p className="text-sm text-muted">CTO</p>
                        </div>
                    </div>
                </div>
            </Card>

            {isEditing && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button onClick={() => setIsEditing(false)}>Save Changes</Button>
                </div>
            )}

        </div>
    );
}
