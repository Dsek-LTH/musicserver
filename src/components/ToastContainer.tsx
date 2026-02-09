"use client";

import React from "react";
import styles from "./toast.module.css";

export function ToastContainer() {
  return (
    <div
      id="toast-container"
      style={{
        position: "absolute",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    ></div>
  );
}

export function ToastComponent({
  message,
  color,
}: {
  message: string;
  color: string;
}) {
  return (
    <div className={styles.container} style={{ backgroundColor: color }}>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
