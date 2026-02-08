
<Card>
    <CardHeader title="Team Management" />
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p className="text-muted">Invite new members to your startup workspace.</p>

        <InviteMemberForm />
    </div>
</Card>

// ... (Existing content)

function InviteMemberForm() {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState(ROLES.TEAM);
    const [inviteLink, setInviteLink] = useState('');
    const { userProfile } = useAuth(); // We need to access AuthContext here

    // We need to import db and addDoc
    // ...

    async function handleInvite(e) {
        e.preventDefault();
        if (!userProfile?.startupId) return;

        try {
            const docRef = await addDoc(collection(db, 'invitations'), {
                email,
                role,
                startupId: userProfile.startupId,
                invitedBy: userProfile.uid,
                status: 'pending',
                createdAt: new Date()
            });

            const link = `${window.location.origin}/signup?invite=${docRef.id}`;
            setInviteLink(link);
        } catch (error) {
            console.error("Error creating invite:", error);
            alert("Failed to create invite.");
        }
    }

    return (
        <div>
            {/* Form UI */}
        </div>
    )
}
