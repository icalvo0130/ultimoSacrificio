import { LoginForm } from "./pages/LoginForm";
import { tableroPage } from "./pages/tableroPage";
import RootApp from "./Root/Root";

customElements.define("login-form", LoginForm);
customElements.define("tablero-page", tableroPage);
customElements.define("root-app", RootApp)

export {
  RootApp,
  LoginForm,
  tableroPage,
};