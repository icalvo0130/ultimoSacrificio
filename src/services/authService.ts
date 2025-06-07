import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import { User } from "../types/types";

export class AuthService {
  static async register(email: string, password: string, username: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        username,
        createdAt: new Date()
      };
      
      await setDoc(doc(db, "users", firebaseUser.uid), user);
      return user;
    } catch (error: any) {
      throw { code: error.code, message: error.message };
    }
  }

  static async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      if (userDoc.exists()) {
        return userDoc.data() as User;
      } else {
        throw new Error("User data not found");
      }
    } catch (error: any) {
      throw { code: error.code, message: error.message };
    }
  }

  static async logout(): Promise<void> {
    await signOut(auth);
  }

  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  static onAuthChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
}