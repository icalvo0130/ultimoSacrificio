import { AuthService } from "../services/authService";

class RootApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupRouting();
    this.setupAuthListener();

    this.addEventListener("route-change", ((e: CustomEvent) => {
      if (e.detail && e.detail.path) {
        window.history.pushState({}, "", e.detail.path);
        this.handleRouteChange();
      }
    }) as EventListener);
  }

  setupAuthListener() {
    AuthService.onAuthChange((user) => {
      const currentPath = window.location.pathname;
      
      if (user) {

        if (currentPath === "/login" || currentPath === "/") {
          window.history.pushState({}, "", "/tasks");
          this.handleRouteChange();
        }
      } else {

        if (currentPath === "/tasks") {
          window.history.pushState({}, "", "/login");
          this.handleRouteChange();
        }
      }
    });
  }

  setupRouting() {
    this.handleRouteChange();
    window.addEventListener("popstate", () => this.handleRouteChange());

    this.shadowRoot?.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "A" && target.hasAttribute("href")) {
        e.preventDefault();
        const href = target.getAttribute("href");
        if (href) {
          window.history.pushState({}, "", href);
          this.handleRouteChange();
        }
      }
    });
  }

  handleRouteChange() {
    if (!this.shadowRoot) return;
    const path = window.location.pathname;
    console.log("Ruta actual:", path);
    const content = this.shadowRoot.querySelector("#content");
    if (!content) return;
    content.innerHTML = "";

    const currentUser = AuthService.getCurrentUser();

    switch (path) {
      case "/":
        if (currentUser) {
          content.innerHTML = `<tasks-page></tasks-page>`;
        } else {
          content.innerHTML = `<login-form></login-form>`;
        }
        break;
      case "/login":
        content.innerHTML = `<login-form></login-form>`;
        break;
      case "/register":
        content.innerHTML = `<login-form mode="register"></login-form>`;
        break;
      case "/tablero":
        if (currentUser) {
          content.innerHTML = `<tablero-page></tablero-page>`;
        } else {
          window.history.pushState({}, "", "/login");
          content.innerHTML = `<login-form></login-form>`;
        }
        break;
      default:
        content.innerHTML = `
          <div style="
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            min-height: 100vh; 
            text-align: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          ">
            <h1 style="font-size: 72px; margin-bottom: 20px;">404</h1>
            <p style="font-size: 24px; margin-bottom: 30px;">Página no encontrada</p>
            <a href="/" style="
              padding: 12px 24px; 
              background: white; 
              color: #8b5cf6; 
              text-decoration: none; 
              border-radius: 8px; 
              font-weight: 600;
              transition: all 0.2s ease;
            ">Volver al inicio</a>
          </div>
        `;
        break;
    }
  }

  render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          --primary-color: #8b5cf6;
          --secondary-color: #a78bfa;
          --background-color: #f8f9fa;
          --card-background: #ffffff;
          --border-color: #e9ecef;
          --text-color: #212529;
          --text-secondary: #6c757d;
          --success-color: #10b981;
          --warning-color: #f59e0b;
          --danger-color: #ef4444;
          --border-radius: 8px;
          --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          color: var(--text-color);
          background-color: var(--background-color);
          margin: 0;
          padding: 0;
        }
        
        * {
          box-sizing: border-box;
        }
        
        .app-container {
          display: flex;
          min-height: 100vh;
        }
        
        .main-content {
          flex: 1;
          overflow-y: auto;
        }
        
        #content {
          min-height: 100vh;
        }
      </style>
      
      <div class="app-container">
        <div class="main-content">
          <main id="content">
          </main>
        </div>
      </div>
    `;
  }
}

export default RootApp;