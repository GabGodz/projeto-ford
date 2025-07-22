import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where, orderBy, limit, setDoc } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app;
  private db;
  private analytics;
  private auth;

  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyCRUA1W0C6X5WOYnwfiZIGFSRyKHt50fV4",
      authDomain: "ford-942a1.firebaseapp.com",
      projectId: "ford-942a1",
      storageBucket: "ford-942a1.firebasestorage.app",
      messagingSenderId: "434577963900",
      appId: "1:434577963900:web:7e405d760509c1849d42f9",
      measurementId: "G-THT6M05809"
    };

    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
    this.analytics = getAnalytics(this.app);
    this.auth = getAuth(this.app);
  }

  // Firebase Authentication methods
  async registerWithEmail(email: string, password: string, userData: any) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Save additional user data to Firestore
      const userDoc = {
        ...userData,
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        createdAt: new Date(),
        trainingAccess: false
      };
      
      await this.addDocument('users', firebaseUser.uid, userDoc);
      return { success: true, user: firebaseUser };
    } catch (error: any) {
      console.error('Error registering user: ', error);
      return { success: false, error: error.message };
    }
  }

  async loginWithEmail(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get additional user data from Firestore
      const userDoc = await this.getDocument('users', firebaseUser.uid);
      
      return { success: true, user: firebaseUser, userData: userDoc };
    } catch (error: any) {
      console.error('Error logging in: ', error);
      return { success: false, error: error.message };
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      return { success: true };
    } catch (error: any) {
      console.error('Error logging out: ', error);
      return { success: false, error: error.message };
    }
  }

  getCurrentFirebaseUser(): FirebaseUser | null {
    return this.auth.currentUser;
  }

  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(this.auth, callback);
  }

  async getDocument(collectionName: string, documentId: string) {
    try {
      const docRef = doc(this.db, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error(`Error getting document from ${collectionName}: `, error);
      throw error;
    }
  }

  // User management
  async addUser(userData: any) {
    try {
      const docRef = await addDoc(collection(this.db, 'users'), userData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding user: ', error);
      throw error;
    }
  }

  async getUsers() {
    try {
      const querySnapshot = await getDocs(collection(this.db, 'users'));
      const users: any[] = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      return users;
    } catch (error) {
      console.error('Error getting users: ', error);
      throw error;
    }
  }

  async getUserByUsername(username: string) {
    try {
      const q = query(collection(this.db, 'users'), where('username', '==', username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting user by username: ', error);
      throw error;
    }
  }

  async updateUser(userId: string, userData: any) {
    try {
      const userRef = doc(this.db, 'users', userId);
      await updateDoc(userRef, userData);
    } catch (error) {
      console.error('Error updating user: ', error);
      throw error;
    }
  }

  async deleteUser(userId: string) {
    try {
      await deleteDoc(doc(this.db, 'users', userId));
    } catch (error) {
      console.error('Error deleting user: ', error);
      throw error;
    }
  }

  // Training management
  async addTraining(trainingData: any) {
    try {
      const docRef = await addDoc(collection(this.db, 'trainings'), trainingData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding training: ', error);
      throw error;
    }
  }

  async getTrainingsByUser(userId: string) {
    try {
      const q = query(collection(this.db, 'trainings'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const trainings: any[] = [];
      querySnapshot.forEach((doc) => {
        trainings.push({ id: doc.id, ...doc.data() });
      });
      return trainings;
    } catch (error) {
      console.error('Error getting trainings: ', error);
      throw error;
    }
  }

  async getAllTrainings() {
    try {
      const querySnapshot = await getDocs(collection(this.db, 'trainings'));
      const trainings: any[] = [];
      querySnapshot.forEach((doc) => {
        trainings.push({ id: doc.id, ...doc.data() });
      });
      return trainings;
    } catch (error) {
      console.error('Error getting all trainings: ', error);
      throw error;
    }
  }

  async updateTraining(trainingId: string, trainingData: any) {
    try {
      const trainingRef = doc(this.db, 'trainings', trainingId);
      await updateDoc(trainingRef, trainingData);
    } catch (error) {
      console.error('Error updating training: ', error);
      throw error;
    }
  }

  async deleteTraining(trainingId: string) {
    try {
      await deleteDoc(doc(this.db, 'trainings', trainingId));
    } catch (error) {
      console.error('Error deleting training: ', error);
      throw error;
    }
  }

  // Assessment management
  async addAssessment(assessmentData: any) {
    try {
      const docRef = await addDoc(collection(this.db, 'assessments'), assessmentData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding assessment: ', error);
      throw error;
    }
  }

  async getAssessmentsByUser(userId: string) {
    try {
      const q = query(collection(this.db, 'assessments'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const assessments: any[] = [];
      querySnapshot.forEach((doc) => {
        assessments.push({ id: doc.id, ...doc.data() });
      });
      return assessments;
    } catch (error) {
      console.error('Error getting assessments: ', error);
      throw error;
    }
  }

  async getAllAssessments() {
    try {
      const querySnapshot = await getDocs(collection(this.db, 'assessments'));
      const assessments: any[] = [];
      querySnapshot.forEach((doc) => {
        assessments.push({ id: doc.id, ...doc.data() });
      });
      return assessments;
    } catch (error) {
      console.error('Error getting all assessments: ', error);
      throw error;
    }
  }

  async updateAssessment(assessmentId: string, assessmentData: any) {
    try {
      const assessmentRef = doc(this.db, 'assessments', assessmentId);
      await updateDoc(assessmentRef, assessmentData);
    } catch (error) {
      console.error('Error updating assessment: ', error);
      throw error;
    }
  }

  async deleteAssessment(assessmentId: string) {
    try {
      await deleteDoc(doc(this.db, 'assessments', assessmentId));
    } catch (error) {
      console.error('Error deleting assessment: ', error);
      throw error;
    }
  }

  // Generic collection methods
  async addDocument(collectionName: string, documentId: string, data: any) {
    try {
      const docRef = doc(this.db, collectionName, documentId);
      await setDoc(docRef, data);
      return documentId;
    } catch (error) {
      console.error(`Error adding document to ${collectionName}: `, error);
      throw error;
    }
  }

  async getCollection(collectionName: string) {
    try {
      const querySnapshot = await getDocs(collection(this.db, collectionName));
      const documents: any[] = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      return documents;
    } catch (error) {
      console.error(`Error getting collection ${collectionName}: `, error);
      throw error;
    }
  }

  async updateDocument(collectionName: string, documentId: string, data: any) {
    try {
      const docRef = doc(this.db, collectionName, documentId);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error(`Error updating document in ${collectionName}: `, error);
      throw error;
    }
  }

  async deleteDocument(collectionName: string, documentId: string) {
    try {
      await deleteDoc(doc(this.db, collectionName, documentId));
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}: `, error);
      throw error;
    }
  }

  async clearCollection(collectionName: string) {
    try {
      const querySnapshot = await getDocs(collection(this.db, collectionName));
      const deletePromises: Promise<void>[] = [];
      
      querySnapshot.forEach((document) => {
        deletePromises.push(deleteDoc(doc(this.db, collectionName, document.id)));
      });
      
      await Promise.all(deletePromises);
      console.log(`Collection ${collectionName} cleared successfully`);
    } catch (error) {
      console.error(`Error clearing collection ${collectionName}: `, error);
      throw error;
    }
  }

  // Training results management
  async addTrainingResult(trainingResult: any) {
    try {
      const docRef = await addDoc(collection(this.db, 'trainingResults'), trainingResult);
      return docRef.id;
    } catch (error) {
      console.error('Error adding training result: ', error);
      throw error;
    }
  }
}