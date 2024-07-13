import React from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";
import { ModalProvider } from "./components/modal/Modal.component";
import { AppComponent } from "./components/app/App.component";
import { MenuProvider } from "./components/menu/useMenu";
import "react-toastify/dist/ReactToastify.css";
import "../public/assets/styles/styles.scss";

const container = document.getElementById("mainBody");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MenuProvider>
        <ModalProvider>
          <AppComponent />
        </ModalProvider>
      </MenuProvider>
      <ToastContainer />
    </BrowserRouter>
  </React.StrictMode>
);
