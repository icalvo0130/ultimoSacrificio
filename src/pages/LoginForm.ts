import { AuthService } from "../services/authService";

export class LoginForm extends HTMLElement {
  private isRegisterMode: boolean = false;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.isRegisterMode = this.getAttribute("mode") === "register";
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const form = this.shadowRoot?.querySelector("#auth-form");
    const toggleLink = this.shadowRoot?.querySelector("#toggle-mode");

    form?.addEventListener("submit", (e) => this.handleSubmit(e));
    toggleLink?.addEventListener("click", (e) => {
      e.preventDefault();
      this.toggleMode();
    });
  }

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.render();
    this.setupEventListeners();
  }

  async handleSubmit(e: Event) {
    e.preventDefault();
    
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const username = formData.get("username") as string;

    const errorDiv = this.shadowRoot?.querySelector("#error-message");
    const submitBtn = this.shadowRoot?.querySelector("#submit-btn") as HTMLButtonElement;

    if (errorDiv) errorDiv.textContent = "";
    if (submitBtn) submitBtn.disabled = true;

    try {
      if (this.isRegisterMode) {
        await AuthService.register(email, password, username);
      } else {
        await AuthService.login(email, password);
      }
      

      this.dispatchEvent(new CustomEvent("route-change", {
        bubbles: true,
        detail: { path: "/tasks" }
      }));
      
    } catch (error: any) {
      if (errorDiv) {
        errorDiv.textContent = this.getErrorMessage(error.code);
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  }

  getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case "auth/user-not-found":
        return "Usuario no encontrado";
      case "auth/wrong-password":
        return "Contraseña incorrecta";
      case "auth/email-already-in-use":
        return "Este email ya está registrado";
      case "auth/weak-password":
        return "La contraseña debe tener al menos 6 caracteres";
      case "auth/invalid-email":
        return "Email inválido";
      default:
        return "Error de autenticación. Intenta nuevamente.";
    }
  }

  render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }
        
        .auth-card {
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }
        
        .auth-title {
          font-size: 28px;
          font-weight: 700;
          text-align: center;
          color: #1f2937;
          margin-bottom: 8px;
        }
        
        .auth-subtitle {
          font-size: 14px;
          color: #6b7280;
          text-align: center;
          margin-bottom: 32px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }
        
        input {
          width: 100%;
          padding: 14px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        
        input:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }
        
        .submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #8b5cf6, #a78bfa);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 16px;
        }
        
        .submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #7c3aed, #8b5cf6);
          transform: translateY(-1px);
        }
        
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .toggle-text {
          text-align: center;
          font-size: 14px;
          color: #6b7280;
        }
        
        .toggle-link {
          color: #8b5cf6;
          text-decoration: none;
          font-weight: 600;
          cursor: pointer;
        }
        
        .toggle-link:hover {
          text-decoration: underline;
        }
        
        .error-message {
          background: #fef2f2;
          color: #dc2626;
          padding: 12px;
          border-radius: 6px;
          font-size: 14px;
          margin-bottom: 16px;
          text-align: center;
          border: 1px solid #fecaca;
        }
      </style>
      
      <div class="auth-container">
        <div class="auth-card">
          <h1 class="auth-title">${this.isRegisterMode ? 'Registro' : 'Iniciar Sesión'}</h1>
          <p class="auth-subtitle">
            ${this.isRegisterMode ? 'Crea tu cuenta para gestionar tus tareas' : 'Accede a tu cuenta'}
          </p>
          
          <form id="auth-form">
            ${this.isRegisterMode ? `
              <div class="form-group">
                <label for="username">Nombre de usuario</label>
                <input type="text" id="username" name="username" required>
              </div>
            ` : ''}
            
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
              <label for="password">Contraseña</label>
              <input type="password" id="password" name="password" required>
            </div>

            <div class="form-group">
              <label for="colores">Elige un color:</label>
              <input list="colores" name="colores" id="colores">
              <datalist id="colores">
              <option value="morado">
              <option value="azul">
              <option value="rojo">
              <option value="amarillo">
              <option value="verde">
            </datalist>
            </div>
            
            <div id="error-message" class="error-message" style="display: none;"></div>
            
            <button type="submit" id="submit-btn" class="submit-btn">
              ${this.isRegisterMode ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </button>
          </form>
          
          <p class="toggle-text">
            ${this.isRegisterMode ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
            <a href="#" id="toggle-mode" class="toggle-link">
              ${this.isRegisterMode ? 'Inicia sesión' : 'Regístrate'}
            </a>
          </p>
        </div>
      </div>
    `;
    const errorDiv = this.shadowRoot.querySelector("#error-message");
    if (errorDiv && errorDiv.textContent) {
      (errorDiv as HTMLElement).style.display = "block";
    }
  }
}