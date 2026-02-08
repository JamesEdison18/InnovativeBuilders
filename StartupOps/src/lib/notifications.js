
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Creates a notification for a user.
 * @param {string} recipientId - UID of the user receiving the notification.
 * @param {string} type - 'task_assignment', 'milestone', 'system', etc.
 * @param {string} title - Short title of the notification.
 * @param {string} message - Body text.
 * @param {string} link - URL or route to navigate to (optional).
 * @param {object} senderProfile - Optional profile of the sender (e.g., { displayName, photoURL }).
 */
export const createNotification = async (recipientId, type, title, message, link = null, senderProfile = null) => {
    try {
        await addDoc(collection(db, 'notifications'), {
            recipientId,
            type,
            title,
            message,
            link,
            read: false,
            createdAt: serverTimestamp(),
            sender: senderProfile ? {
                displayName: senderProfile.displayName || 'Unknown',
                photoURL: senderProfile.photoURL || null
            } : null
        });
        console.log(`Notification sent to ${recipientId}`);
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};
