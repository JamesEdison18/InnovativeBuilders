import React, { useState, useEffect } from 'react';
import { useRole, ROLES } from '../contexts/RoleContext';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Building, Globe, MapPin, Mail, Edit2, Loader2, User, Upload, Camera } from 'lucide-react';
import InviteMember from '../components/profile/InviteMember';

export default function Profile() {
    const { role } = useRole();
    const { userProfile } = useAuth();
    const canEdit = [ROLES.FOUNDER, ROLES.CO_FOUNDER].includes(role);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [startup, setStartup] = useState(null);
    const [team, setTeam] = useState([]);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        if (!userProfile?.startupId) {
            setLoading(false);
            return;
        }

        const startupRef = doc(db, 'startups', userProfile.startupId);

        // Subscribe to Startup Data
        const unsubscribeStartup = onSnapshot(startupRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setStartup(data);
                setEditForm(data);
            }
        });

        // Subscribe to Team Data
        const teamQuery = query(collection(db, 'users'), where('startupId', '==', userProfile.startupId));
        const unsubscribeTeam = onSnapshot(teamQuery, (snapshot) => {
            const teamMembers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTeam(teamMembers);
            setLoading(false);
        });

        return () => {
            unsubscribeStartup();
            unsubscribeTeam();
        };
    }, [userProfile]);

    const handleSave = async () => {
        if (!userProfile?.startupId) return;
        setLoading(true);
        try {
            await updateDoc(doc(db, 'startups', userProfile.startupId), editForm);
            // Update local state is handled by snapshot listener, but we close edit mode
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !userProfile?.startupId) return;

        try {
            setLoading(true);
            const storage = getStorage();
            console.log("DEBUG: Starting Upload");
            console.log("DEBUG: Storage Instance:", storage);
            console.log("DEBUG: File:", file);

            if (!storage) throw new Error("Firebase Storage instance is missing/undefined in Profile.jsx");

            const path = `startups/${userProfile.startupId}/logo`;
            console.log("DEBUG: Upload Path:", path);

            const storageRef = ref(storage, path);
            console.log("DEBUG: Storage Ref:", storageRef);

            await uploadBytes(storageRef, file);
            console.log("DEBUG: Upload Bytes Complete");

            const downloadURL = await getDownloadURL(storageRef);
            console.log("DEBUG: Download URL obtained:", downloadURL);

            await updateDoc(doc(db, 'startups', userProfile.startupId), {
                logoUrl: downloadURL
            });

            setStartup(prev => ({ ...prev, logoUrl: downloadURL }));

            // Reload removed. Sidebar listens to changes.
            alert("Upload successful! The logo should update immediately.");

            setLoading(false);
        } catch (error) {
            console.error("FULL UPLOAD ERROR:", error);
            alert(`Upload failed: ${error.message} (${error.code || 'Unknown'})`);
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    if (!startup) return <div className="p-8 text-center text-muted">No startup profile found.</div>;

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
                    {/* Logo Placeholder / Image */}
                    <div className="relative group">
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: 'var(--radius-lg)',
                            background: '#F1F5F9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            fontWeight: 700,
                            color: 'var(--primary)',
                            overflow: 'hidden',
                            border: '1px solid var(--border)'
                        }}>
                            {startup.logoUrl ? (
                                <img
                                    src={startup.logoUrl}
                                    alt="Startup Logo"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        console.error("Error loading image URL:", startup.logoUrl);
                                        e.target.style.display = 'none';
                                        e.target.parentNode.style.backgroundColor = '#F1F5F9';
                                        e.target.parentNode.innerHTML = startup.name ? startup.name.charAt(0).toUpperCase() : 'S';
                                        e.target.parentNode.style.display = 'flex';
                                        e.target.parentNode.style.alignItems = 'center';
                                        e.target.parentNode.style.justifyContent = 'center';
                                        e.target.parentNode.style.fontSize = '2rem';
                                        e.target.parentNode.style.color = 'var(--primary)';
                                    }}
                                />
                            ) : (
                                startup.name ? startup.name.charAt(0).toUpperCase() : 'S'
                            )}
                        </div>

                        {canEdit && isEditing && (
                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    style={{ display: 'none' }}
                                    onChange={handleImageUpload}
                                />
                                <Camera className="text-white w-8 h-8" />
                            </label>
                        )}
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            {isEditing ? (
                                <div className="flex flex-col gap-3 w-full">
                                    <input
                                        type="text"
                                        value={editForm.name || ''}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full rounded-md font-bold text-xl outline-none focus:border-blue-500 transition-colors"
                                        style={{
                                            backgroundColor: '#1E293B',
                                            border: '1px solid #475569',
                                            color: '#F8FAFC',
                                            padding: '0.75rem'
                                        }}
                                        placeholder="Startup Name"
                                    />
                                    <input
                                        type="text"
                                        value={editForm.tagline || ''}
                                        onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                                        className="w-full rounded-md outline-none focus:border-blue-500 transition-colors"
                                        style={{
                                            backgroundColor: '#1E293B',
                                            border: '1px solid #475569',
                                            color: '#CBD5E1', /* Slate 300 */
                                            padding: '0.75rem'
                                        }}
                                        placeholder="Tagline (e.g. Building the future of...)"
                                    />
                                </div>
                            ) : (
                                <>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{startup.name}</h2>
                                    <p className="text-muted">{startup.tagline || 'No tagline set'}</p>
                                </>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Badge variant="blue">{startup.stage || 'Pre-Seed'}</Badge>
                            <Badge variant="gray">{team.length} {team.length === 1 ? 'Member' : 'Members'}</Badge>
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.5rem 0' }} />

                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                                <Globe size={18} />
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editForm.website || ''}
                                        onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                                        className="w-full rounded outline-none focus:border-blue-500 transition-colors"
                                        style={{
                                            backgroundColor: '#1E293B',
                                            border: '1px solid #475569',
                                            color: '#F8FAFC',
                                            padding: '0.5rem 0.75rem'
                                        }}
                                        placeholder="Website URL (https://...)"
                                    />
                                ) : (
                                    <span>{startup.website || 'Add website'}</span>
                                )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                                <MapPin size={18} />
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editForm.location || ''}
                                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                        className="w-full rounded outline-none focus:border-blue-500 transition-colors"
                                        style={{
                                            backgroundColor: '#1E293B',
                                            border: '1px solid #475569',
                                            color: '#F8FAFC',
                                            padding: '0.5rem 0.75rem'
                                        }}
                                        placeholder="Location (e.g. San Francisco, CA)"
                                    />
                                ) : (
                                    <span>{startup.location || 'Add location'}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <Card>
                <CardHeader title="About" />
                {isEditing ? (
                    <textarea
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full rounded-md outline-none focus:border-blue-500 transition-colors"
                        style={{
                            backgroundColor: '#1E293B',
                            border: '1px solid #475569',
                            color: '#F8FAFC',
                            padding: '1rem',
                            minHeight: '120px'
                        }}
                        placeholder="Describe your startup's mission, vision, and what you do..."
                    />
                ) : (
                    <p style={{ lineHeight: 1.6 }}>{startup.description || 'No description yet.'}</p>
                )}
            </Card>

            <Card>
                <CardHeader title="Team" />
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                    {team.map(member => (
                        <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={20} className="text-muted" />
                            </div>
                            <div>
                                <p style={{ fontWeight: 600 }}>{member.displayName || member.email}</p>
                                <p className="text-sm text-muted">
                                    {member.role === 'TEAM' ? 'Team Member' :
                                        member.role === 'CO_FOUNDER' ? 'Co-Founder' :
                                            member.role ? member.role.charAt(0).toUpperCase() + member.role.slice(1).toLowerCase() : 'Member'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Invite Section */}
            {canEdit && <InviteMember />}

            {isEditing && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </div>
            )}

        </div>
    );
}
