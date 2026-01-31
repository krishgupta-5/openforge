import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function createUserIfNotExists(user: any) {
  const userRef = doc(db, "users", user.id);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      id: user.id,
      name: `${user.firstName || ""} ${user.lastName || ""}`,
      email: user.emailAddresses[0]?.emailAddress,
      github: user.githubUsername || "",
      linkedin: user.linkedinUsername || "",
      createdAt: new Date(),
    });
  }
}

export async function getUserData(userId: string) {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}
