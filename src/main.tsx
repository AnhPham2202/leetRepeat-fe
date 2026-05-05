import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { TodayPage } from "./components/TodayPage";
import { AddPage } from "./components/AddPage";
import { SettingsPage } from "./components/SettingsPage";
import { getOrCreateUserId } from "./user-id";
import "./index.css";

const userId = getOrCreateUserId();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout userId={userId} />}>
          <Route path="/" element={<TodayPage userId={userId} />} />
          <Route path="/add" element={<AddPage userId={userId} />} />
          <Route path="/settings" element={<SettingsPage userId={userId} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
