import { db } from '../lib/firebase';
import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';

export const seedDatabase = async () => {
    console.log("Starting database seed...");
    try {
        const batch = writeBatch(db);


        // 1. Create Startup
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
        const feedbacks = [
            { id: 'fb_1', content: 'Onboarding flow is confusing.', status: 'Open', type: 'internal', author: 'Mentor Sarah' },
            { id: 'fb_2', content: 'Great design!', status: 'Addressed', type: 'external', author: 'User #42' }
        ];

        feedbacks.forEach(fb => {
            const ref = doc(db, 'feedback', fb.id);
            batch.set(ref, { ...fb, startupId: 'startup_001', date: new Date() });
        });

        await batch.commit();
        console.log("Database seeded successfully!");
        alert("Database seeded! Refresh the page.");
    } catch (e) {
        console.error("Error seeding database:", e);
        alert("Error seeding database: " + e.message);
    }
};
