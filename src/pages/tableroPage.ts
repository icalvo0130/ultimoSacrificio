import { TaskService } from "../services/taskService";
import { AuthService } from "../services/authService";
import { Task } from "../types/types";

export class tableroPage extends HTMLElement {
  private unsubscribe: (() => void) | null = null;
  private currentUser: any = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.currentUser = AuthService.getCurrentUser();
    if (!this.currentUser) {
      this.dispatchEvent(new CustomEvent("route-change", {
        bubbles: true,
        detail: { path: "/login" }
      }));
      return;
    }

    this.render();
    this.subscribeToTasks();
  }

  disconnectedCallback() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  async handleLogout() {
    try {
      await AuthService.logout();
      this.dispatchEvent(new CustomEvent("route-change", {
        bubbles: true,
        detail: { path: "/login" }
      }));
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  subscribeToTasks() {
    if (!this.currentUser) return;

    console.log("Subscribing to tasks for user:", this.currentUser.uid);
    
    this.unsubscribe = TaskService.subscribeToUserTasks(
      this.currentUser.uid,
      (tasks: Task[]) => {
        console.log("Tasks received from Firebase:", tasks);
        this.updateTaskLists(tasks);
      }
    );
  }

  updateTaskLists(tasks: Task[]) {
    const pendingList = this.shadowRoot?.querySelector("#pending-list") as any;
    const completedList = this.shadowRoot?.querySelector("#completed-list") as any;

    console.log("Updating task lists with tasks:", tasks);
    
    if (pendingList) {
      console.log("Updating pending list");
      pendingList.setTasks(tasks);
    }
    if (completedList) {
      console.log("Updating completed list");
      completedList.setTasks(tasks);
    }
  }

  render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
             .header {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(67, 97, 238, 0.1);
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .app-title {
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(135deg, #8b5cf6, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .welcome-text {
          font-size: 16px;
          color: #6b7280;
  } 
      </style>
      <div class= header>
            <span class="welcome-text">Bienvenido, ${this.currentUser?.email}</span>
            <h3>al tablero mas grande del mundo</h3>
            <button id="logout-btn" class="logout-btn">Cerrar Sesión</button>
      </div> 
    `;
  }
}