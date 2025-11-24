// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import HomePage from "./pages/HomePage";
import NodePage from "./pages/NodePage";
import AddCategoryPage from "./pages/AddCategoryPage";

import { createRootIfMissing } from "./services/firestoreService";

export default function App() {
  const [root, setRoot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const r = await createRootIfMissing();
        setRoot(r);
      } catch (err) {
        console.error("Firestore init error:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  if (loading || !root) {
    return <div className="page-container">Loading data...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage rootId={root.id} />} />
        <Route
          path="/add-category"
          element={<AddCategoryPage rootId={root.id} />}
        />
        {/* node + any nested part (/*) */}
        <Route path="/node/:nodeId/*" element={<NodePage />} />
      </Routes>
    </BrowserRouter>
  );
}
