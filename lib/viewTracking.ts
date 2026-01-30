import { doc, updateDoc, arrayUnion, getDoc, getDocs, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

interface ViewRecord {
  userId?: string;
  timestamp: any;
  userAgent?: string;
  ip?: string;
}

export async function trackProjectView(projectId: string, userId?: string) {
  try {
    const projectRef = doc(db, "projects", projectId);
    const projectDoc = await getDoc(projectRef);

    if (!projectDoc.exists()) {
      console.error("Project not found:", projectId);
      return;
    }

    const projectData = projectDoc.data();
    const currentViews = projectData.views || 0;
    
    // Update the view count
    await updateDoc(projectRef, {
      views: currentViews + 1,
      lastViewedAt: serverTimestamp()
    });

    // Optionally track detailed view analytics in a separate collection
    const viewRecord: ViewRecord = {
      userId,
      timestamp: serverTimestamp(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      ip: typeof window !== 'undefined' ? await getClientIP() : undefined
    };

    const analyticsRef = doc(db, "projectAnalytics", projectId);
    await updateDoc(analyticsRef, {
      totalViews: arrayUnion(viewRecord),
      updatedAt: serverTimestamp()
    }).catch(async () => {
      // If document doesn't exist, create it
      await updateDoc(analyticsRef, {
        projectId,
        totalViews: [viewRecord],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    });

    console.log("View tracked for project:", projectId);
  } catch (error) {
    console.error("Error tracking view:", error);
  }
}

async function getClientIP(): Promise<string | undefined> {
  try {
    // Simple IP fetching - you might want to use a more sophisticated method
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error fetching IP:", error);
    return undefined;
  }
}

export async function getTotalViews() {
  try {
    const projectsSnapshot = await getDocs(collection(db, "projects"));
    let totalViews = 0;
    
    projectsSnapshot.forEach((doc: any) => {
      const projectData = doc.data();
      totalViews += projectData.views || 0;
    });
    
    return totalViews;
  } catch (error) {
    console.error("Error fetching total views:", error);
    return 0;
  }
}
