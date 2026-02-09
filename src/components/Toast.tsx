"use client";
import React from "react";
import { createRoot } from "react-dom/client";
import { ToastComponent } from "./ToastContainer";

export class Toast extends React.Component {
  static currentToast: boolean;
  static timeout: ReturnType<typeof setTimeout> | null;

  currentToast = false;
  timeout = null;

  static remove() {
    const toastContainer = createRoot(
      document.getElementById("toast-container") as HTMLElement
    );
    toastContainer.unmount();
    Toast.currentToast = false;
    if (Toast.timeout) {
      clearTimeout(Toast.timeout);
      Toast.timeout = null;
    }
  }

  static add(message: string, options: any = null) {
    let duration = 5;
    let color = "light-green";

    if (options) {
      if (options.duration) {
        duration = options.duration;
      }

      if (options.type === "info") {
        color = "blue";
      }

      if (options.type === "success") {
        color = "green";
      }

      if (options.type === "error") {
        color = "red";
      }

      if (options.type === "warn") {
        color = "orange";
      }
    }

    if (message == "Insufficient permissions") {
      color = "red";
    }

    if (Toast.currentToast) {
      Toast.remove();
    }

    const toastContainer = createRoot(
      document.getElementById("toast-container") as HTMLElement
    );
    toastContainer.render(<ToastComponent message={message} color={color} />);

    Toast.currentToast = true;
    Toast.timeout = setTimeout(Toast.remove, duration * 1000);
  }
}
