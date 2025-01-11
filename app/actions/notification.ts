import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/app/db";
import createImgbbUrl, { IMGBB } from "@/app/helpers/imgbb";

export type Notification = {
  android_channel_id: string;
  body: string;
  image?: File | null;
  imageUrl?: IMGBB | null;
  link: string;
  title: string;
  time: number; // Epoch time in milliseconds
};

export type NotificationsDTO = {
  [key: string]: Notification;
};

export async function getAllNotifications(): Promise<NotificationsDTO> {
  try {
    const querySnapshot = await getDocs(collection(db, "notifications"));
    const notifications: NotificationsDTO = {};
    querySnapshot.forEach((doc) => {
      notifications[doc.id] = doc.data() as Notification;
    });
    return notifications;
  } catch (error) {
    console.error("Error fetching notifications: ", error);
    throw new Error("Failed to fetch notifications");
  }
}
export async function getNotificationById(id: string): Promise<Notification> {
  try {
    const docRef = doc(db, "notifications", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Notification;
    } else {
      throw new Error("Notification not found");
    }
  } catch (error) {
    console.error("Error fetching notification: ", error);
    throw new Error("Failed to fetch notification");
  }
}
export async function createNotification(
  notification: Notification
): Promise<string> {
  try {
    if (!notification.image) {
      throw new Error("Failed to create notification");
    }
    const collectionRef = collection(db, "notifications");
    const imgbb: IMGBB | null = await createImgbbUrl(notification.image);
    delete notification.image;
    const docref = await addDoc(collectionRef, {
      ...notification,
      imageUrl: imgbb,
      createdAt: Date.now(),
    });
    console.log("Notification created successfully");
    return docref.id;
  } catch (error) {
    console.error("Error creating notification: ", error);
    throw new Error("Failed to create notification");
  }
}

export async function updateNotification(
  id: string,
  updatedData: Partial<Notification>
): Promise<boolean> {
  try {
    const sponsorDocRef = doc(db, "sponsors", id);
    if (updatedData.image) {
      const imgbb: IMGBB | null = await createImgbbUrl(updatedData.image);
      delete updatedData.image;
      if (imgbb) updatedData.imageUrl = imgbb;
    }
    await updateDoc(sponsorDocRef, {
      ...updatedData,
      updatedAt: Date.now(),
    });
    console.log("Sponsor updated successfully!");
    return true;
  } catch (error) {
    console.error("Error updating Sponsor:", error);
    return false;
  }
}

export async function deleteNotification(id: string): Promise<void> {
  try {
    const docRef = doc(db, "notifications", id);
    await deleteDoc(docRef);
    console.log("Notification deleted successfully");
  } catch (error) {
    console.error("Error deleting notification: ", error);
    throw new Error("Failed to delete notification");
  }
}

/**
 * const newNotification: Notification = {
  android_channel_id: "general",
  body: "Don't miss our latest update!",
  image: null,
  link: "https://example.com/update",
  title: "Latest Update",
  time: Date.now(),
};

createNotification(newNotification)
  .then(() => console.log("Notification created"))
  .catch(console.error);

  getAllNotifications()
  .then((notifications) => console.log("Notifications: ", notifications))
  .catch(console.error);
getNotificationById("notification_id")
  .then((notification) => console.log("Notification: ", notification))
  .catch(console.error);
deleteNotification("notification_id")
  .then(() => console.log("Notification deleted"))
  .catch(console.error);

 */