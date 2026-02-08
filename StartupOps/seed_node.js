// seed_node.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, writeBatch } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD9ifWHXlaGFayQEqOxj1qYu9rEBaIoGwU",
    authDomain: "startupops-backend-v1.firebaseapp.com",
    projectId: "startupops-backend-v1",
    storageBucket: "startupops-backend-v1.firebasestorage.app",
    messagingSenderId: "296108987545",
    appId: "1:296108987545:web:e8e0cd0fc084de0746d408"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const seed = async () => {
    console.log("Attempting to connect to Firestore...");
    try {
        const batch = writeBatch(db);

        // 1. Create Startup
        console.log("Preparing Startup data...");
        const startupRef = doc(db, 'startups', 'startup_001');
        batch.set(startupRef, {
            name: "StartupOps Demo",
            stage: "Seed",
            industry: "SaaS",
            foundedDate: "2026-01-01",
            description: "The operating system for your startup.",
            teamSize: 5
        });

        // 2. Create Tasks
        console.log("Preparing Tasks...");
        const tasks = [
            { id: 'task_1', title: 'Finalize Pitch Deck', status: 'In Progress', priority: 'High', assignee: 'Founder' },
            { id: 'task_2', title: 'Integrate Payment Gateway', status: 'Pending', priority: 'Medium', assignee: 'Dev Team' },
            { id: 'task_3', title: 'User Interviews', status: 'Done', priority: 'High', assignee: 'Co-Founder' }
        ];

        tasks.forEach(task => {
            const ref = doc(db, 'tasks', task.id);
            batch.set(ref, { ...task, startupId: 'startup_001', createdAt: new Date() });
        });

        // 3. Create Feedback
        console.log("Preparing Feedback...");
        const feedbacks = [
            { id: 'fb_1', content: 'Onboarding flow is confusing.', status: 'Open', type: 'internal', author: 'Mentor Sarah' },
            { id: 'fb_2', content: 'Great design!', status: 'Addressed', type: 'external', author: 'User #42' }
        ];

        feedbacks.forEach(fb => {
            const ref = doc(db, 'feedback', fb.id);
            batch.set(ref, { ...fb, startupId: 'startup_001', date: new Date() });
        });

        // 4. Create Milestones
        console.log("Preparing Milestones...");
        const milestones = [
            { id: 'ms_1', title: 'MVP Launch', status: 'Upcoming', date: '2026-04-01', description: 'Initial public release' },
            { id: 'ms_2', title: 'First 100 Users', status: 'Pending', date: '2026-05-15' }
        ];

        milestones.forEach(ms => {
            const ref = doc(db, 'milestones', ms.id);
            batch.set(ref, { ...ms, startupId: 'startup_001' });
        });

        // 5. Create Chats
        console.log("Preparing Chats...");
        const chatRef = doc(db, 'chats', 'msg_1');
        batch.set(chatRef, {
            startupId: 'startup_001',
            text: 'Welcome to the team demo chat!',
            senderName: 'System',
            senderRole: 'admin',
            timestamp: new Date(),
            channel: 'general'
        });

        // 6. Create Validation Experiments
        console.log("Preparing Experiments...");
        const expRef = doc(db, 'validation_experiments', 'exp_1');
        batch.set(expRef, {
            startupId: 'startup_001',
            title: 'Pricing A/B Test',
            status: 'Running',
            metrics: { conversion: 15 }
        });

        console.log("Committing batch write...");
        // Use a timeout to detect hangs
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), 10000));
        await Promise.race([batch.commit(), timeout]);

        console.log("SUCCESS: Database populated!");
        process.exit(0);
    } catch (e) {
        console.error("FAILURE: Could not write to database.");
        console.error("Error code:", e.code);
        console.error("Error message:", e.message);
        process.exit(1);
    }
};

seed();
