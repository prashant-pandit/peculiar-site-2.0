import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAmbientTheme } from "../hooks";
import { AudioPlayerProvider } from "../context/AudioPlayerContext";
import { Footer, Header } from "./layout";
import { HomePage, ReleasesPage } from "./pages";
import { PersistentAudioPlayer, PurchaseModal } from "./player";

export default function App() {
  const ambientTheme = useAmbientTheme();

  return (
    <AudioPlayerProvider>
      <div className="flex min-h-screen flex-col bg-background selection:bg-primary selection:text-black">
        <Header />
        <main className={`flex-1 ambient-theme-${ambientTheme}`}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/releases" element={<ReleasesPage />} />
            <Route path="/release" element={<Navigate to="/releases" replace />} />
            <Route path="/musictrack" element={<Navigate to="/releases" replace />} />
            <Route path="/musictracks" element={<Navigate to="/releases" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <PersistentAudioPlayer />
        <PurchaseModal />
      </div>
    </AudioPlayerProvider>
  );
}
