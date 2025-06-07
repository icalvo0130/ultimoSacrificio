import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  getDocs 
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Task } from "../types/types";

export class TaskService {
  static async createTask(titulo: string, descripcion: string, userId: string): Promise<void> {
    try {
      await addDoc(collection(db, "tasks"), {
        titulo,
        descripcion,
        status: "pending",
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  static async updateTaskStatus(taskId: string, status: 'pending' | 'completed'): Promise<void> {
    try {
      await updateDoc(doc(db, "tasks", taskId), {
        status,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  static async deleteTask(taskId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }

  static async getUserTasks(userId: string): Promise<Task[]> {
    try {
      const q = query(
        collection(db, "tasks"),
        where("userId", "==", userId)
      );
      
      const querySnapshot = await getDocs(q);
      const tasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Task));
      

      return tasks.sort((a: any, b: any) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
        return dateB - dateA;
      });
    } catch (error) {
      console.error("Error getting tasks:", error);
      throw error;
    }
  }

  static subscribeToUserTasks(userId: string, callback: (tasks: Task[]) => void) {
    console.log("Creating subscription for user:", userId);
    
    const q = query(
      collection(db, "tasks"),
      where("userId", "==", userId)
    );
    
    return onSnapshot(q, 
      (querySnapshot) => {
        console.log("Received snapshot with", querySnapshot.docs.length, "documents");
        
        const tasks = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log("Task data:", data);
          return {
            id: doc.id,
            ...data
          } as Task;
        });
        

        const sortedTasks = tasks.sort((a: any, b: any) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
          return dateB - dateA;
        });
        
        console.log("Sending sorted tasks to callback:", sortedTasks);
        callback(sortedTasks);
      },
      (error) => {
        console.error("Error in snapshot listener:", error);
        callback([]);
      }
    );
  }
}