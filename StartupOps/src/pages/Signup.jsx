import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { db } from '../lib/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [startupName, setStartupName] = useState(''); // Only for founders
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Check for invite
    const [searchParams] = useSearchParams();
    const inviteId = searchParams.get('invite');
    const [inviteData, setInviteData] = useState(null);

    const { signup, createUserProfile } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (inviteId) {
            async function fetchInvite() {
                try {
                    const docRef = doc(db, 'invitations', inviteId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setInviteData(docSnap.data());
                        setEmail(docSnap.data().email); // Pre-fill email
                    } else {
                        setError('Invalid or expired invitation.');
                    }
                } catch (e) {
                    console.error("Error checking invite:", e);
                    setError('Error verifying invitation.');
                }
            }
            fetchInvite();
        }
    }, [inviteId]);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);

            // 1. Create Auth User
            const userCredential = await signup(email, password);
            const user = userCredential.user;
            let startupId = '';
            let role = 'FOUNDER';

            if (inviteId && inviteData) {
                // Member Flow
                startupId = inviteData.startupId;
                role = inviteData.role;
            } else {
                // Founder Flow: Create new Startup
                // Using a simple ID generation or let Firestore generate it
                const startupRef = doc(db, 'startups', 'startup_' + user.uid.slice(0, 5));
                startupId = startupRef.id;

                await setDoc(startupRef, {
                    name: startupName,
                    foundedDate: new Date().toISOString(),
                    teamSize: 1,
                    industry: 'Tech', // Default
                    stage: 'Idea'    // Default
                });
            }

            // 2. Create User Profile
            await createUserProfile(user.uid, {
                email: user.email,
                displayName: name,
                role: role,
                startupId: startupId
            });

            // 3. Mark Invite as Used (Optional: delete it)
            if (inviteId) {
                // await deleteDoc(doc(db, 'invitations', inviteId));
            }

            navigate('/dashboard');

        } catch (err) {
            setError('Failed to create an account. ' + err.message);
            console.error(err);
        }
        setLoading(false);
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-body)', color: 'var(--text-main)' }}>
            <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
                    {inviteData ? 'Join Your Team' : 'Start Your Journey'}
                </h2>
                {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-body)', border: '1px solid var(--border)', color: 'white' }}
                        />
                    </div>

                    {!inviteData && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Startup Name</label>
                            <input
                                type="text"
                                required
                                value={startupName}
                                onChange={(e) => setStartupName(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-body)', border: '1px solid var(--border)', color: 'white' }}
                                placeholder="e.g. Pied Piper"
                            />
                        </div>
                    )}

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Email</label>
                        <input
                            type="email"
                            required
                            readOnly={!!inviteData}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-body)', border: '1px solid var(--border)', color: 'white', opacity: inviteData ? 0.7 : 1 }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-body)', border: '1px solid var(--border)', color: 'white' }}
                            placeholder="At least 6 characters"
                        />
                    </div>

                    <Button disabled={loading} type="submit" style={{ marginTop: '0.5rem' }}>
                        {inviteData ? 'Join Team' : 'Create Account'}
                    </Button>
                </form>
                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Log In</Link>
                </div>
            </div>
        </div>
    );
}
