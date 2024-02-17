import { ConfigProvider } from "antd";
import "antd/dist/reset.css";
import { AuthProvider } from "react-auth-kit";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import SettingProvider from "./app/context/SettingProver";
import "./index.css";
import store from "./redux/store";

const rootEl = document.getElementById("root") as HTMLElement;

const root = createRoot(rootEl);

const body = document.body as HTMLElement;

body.classList.add("scrollbar-hide");

root.render(
  <Provider store={store}>
    <AuthProvider
      authName="_auth"
      authType="cookie"
      cookieDomain={window.location.hostname}
      cookieSecure={true}
    >
      <SettingProvider>
        <BrowserRouter>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#1878f3",
                colorError: "#dc3545",
                colorWhite: "#fff",
              },
              components: {
                Spin: {
                  colorPrimary: "#051831",
                  colorWhite: "#fff",
                },
              },
            }}
          >
            <App />
            <ToastContainer />
          </ConfigProvider>
        </BrowserRouter>
      </SettingProvider>
    </AuthProvider>
  </Provider>
);
