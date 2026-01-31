// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc, query, where, orderBy, Timestamp, serverTimestamp } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Idea interface
export interface Idea {
  id?: string;
  title: string;
  problem: string;
  solution: string;
  category: string;
  difficulty: string;
  lookingFor: string;
  helpContext: string;
  leadProject: boolean;
  name: string;
  github: string;
  linkedin?: string;
  mobile?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Create a new idea
export async function createIdea(ideaData: Omit<Idea, 'id' | 'createdAt' | 'updatedAt' | 'status'>) {
  try {
    const docRef = await addDoc(collection(db, 'ideas'), {
      ...ideaData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating idea:', error);
    throw error;
  }
}

// Get all ideas with optional status filter
export async function getIdeas(status?: 'pending' | 'approved' | 'rejected') {
  try {
    let q;
    
    if (status) {
      q = query(collection(db, 'ideas'), where('status', '==', status), orderBy('createdAt', 'desc'));
    } else {
      q = query(collection(db, 'ideas'), orderBy('createdAt', 'desc'));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Idea[];
  } catch (error) {
    console.error('Error getting ideas:', error);
    throw error;
  }
}

// Get a single idea by ID
export async function getIdeaById(id: string) {
  try {
    const ideas = await getIdeas();
    return ideas.find(idea => idea.id === id);
  } catch (error) {
    console.error('Error getting idea by ID:', error);
    throw error;
  }
}

// Update idea status
export async function updateIdeaStatus(id: string, status: 'pending' | 'approved' | 'rejected') {
  try {
    const ideaRef = doc(db, 'ideas', id);
    await updateDoc(ideaRef, {
      status,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating idea status:', error);
    throw error;
  }
}

// Delete an idea
export async function deleteIdea(id: string) {
  try {
    await deleteDoc(doc(db, 'ideas', id));
  } catch (error) {
    console.error('Error deleting idea:', error);
    throw error;
  }
}

// Voting functions
export async function addVote(ideaId: string, userId: string) {
  try {
    const voteRef = doc(db, 'votes', `${ideaId}_${userId}`);
    await setDoc(voteRef, {
      ideaId,
      userId,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error adding vote:', error);
    throw error;
  }
}

export async function removeVote(ideaId: string, userId: string) {
  try {
    const voteRef = doc(db, 'votes', `${ideaId}_${userId}`);
    await deleteDoc(voteRef);
  } catch (error) {
    console.error('Error removing vote:', error);
    throw error;
  }
}

export async function getVoteCount(ideaId: string) {
  try {
    const votesQuery = query(collection(db, 'votes'), where('ideaId', '==', ideaId));
    const querySnapshot = await getDocs(votesQuery);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting vote count:', error);
    return 0;
  }
}

export async function hasUserVoted(ideaId: string, userId: string) {
  try {
    const voteRef = doc(db, 'votes', `${ideaId}_${userId}`);
    const voteDoc = await getDoc(voteRef);
    return voteDoc.exists();
  } catch (error) {
    console.error('Error checking if user voted:', error);
    return false;
  }
}

export { app, db };
