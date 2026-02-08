import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Button } from '../ui/Button';
import { Card, CardHeader } from '../ui/Card';
import { ROLES } from '../../contexts/RoleContext';

export default function InviteMember() {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('TEAM'); // Default role
    const [inviteLink, setInviteLink] = useState('');
    const [loading, setLoading] = useState(false);
    const { userProfile } = useAuth();

    async function handleInvite(e) {
        e.preventDefault();
        if (!userProfile?.startupId) {
            alert("No startup associated with this account.");
            return;
        }

        try {
            setLoading(true);
            const docRef = await addDoc(collection(db, 'invitations'), {
                email,
                role,
                startupId: userProfile.startupId,
                invitedBy: userProfile.uid || 'unknown',
                status: 'pending',
                createdAt: new Date()
            });

            // Generate Link
            const link = `${window.location.origin}/signup?invite=${docRef.id}`;
            setInviteLink(link);

            // Optional: You could use a mailto link here to "send" it
            // window.location.href = `mailto:${email}?subject=Join my startup&body=Click here: ${link}`;

        } catch (error) {
            console.error("Error creating invite:", error);
            alert("Failed to create invite.");
        }
        setLoading(false);
    }

    return (
        <Card>
            <CardHeader title="Invite New Member" />
            <div style={{ padding: '0 1rem 1rem' }}>
                {!inviteLink ? (
                    <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-body)', border: '1px solid var(--border)', color: 'white' }}
                                placeholder="colleague@example.com"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Role</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-body)', border: '1px solid var(--border)', color: 'white' }}
                            >
                                <option value="CO_FOUNDER">Co-Founder</option>
                                <option value="TEAM">Team Member</option>
                                <option value="MENTOR">Mentor</option>
                            </select>
                        </div>
                        <Button disabled={loading} type="submit">Generate Invite Link</Button>
                    </form>
                ) : (
                    <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--primary)' }}>
                        <p style={{ marginBottom: '0.5rem', fontWeight: 600, color: 'var(--primary)' }}>Invitation Created!</p>
                        <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>Share this link with <strong>{email}</strong>:</p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                readOnly
                                value={inviteLink}
                                style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg-body)', color: 'var(--text-secondary)', fontSize: '0.8rem' }}
                            />
                            <Button size="sm" onClick={() => { navigator.clipboard.writeText(inviteLink); alert('Copied!'); }}>Copy</Button>
                        </div>
                        <Button
                            variant="ghost"
                            style={{ marginTop: '1rem', width: '100%' }}
                            onClick={() => { setInviteLink(''); setEmail(''); }}
                        >
                            Invite Another
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
}
