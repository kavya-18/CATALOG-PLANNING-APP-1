// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import HomePage from "./pages/HomePage";
import NodePage from "./pages/NodePage";
import AddCategoryPage from "./pages/AddCategoryPage";
import { initialTree } from "./data/initialTree";

import { db } from "./firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function App() {
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load tree from Firestore once
  useEffect(() => {
    async function loadTree() {
      try {
        const ref = doc(db, "tree", "root");
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          await setDoc(ref, initialTree);
          setTree(initialTree);
        } else {
          setTree(snap.data());
        }

        setLoading(false);
      } catch (err) {
        console.error("🔥 Firestore error:", err);
        setLoading(false);
      }
    }

    loadTree();
  }, []);

  // Save helper – used by HomePage & NodePage
  const saveTree = async (nextTree) => {
    setTree(nextTree);
    try {
      const ref = doc(db, "tree", "root");
      await setDoc(ref, nextTree);
    } catch (err) {
      console.error("Firestore save error:", err);
      alert("Could not save changes. Check console for details.");
    }
  };

  if (loading || !tree) {
    return <div className="page-container">Loading data...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<HomePage tree={tree} saveTree={saveTree} />}
        />
        <Route
          path="/add-category"
          element={<AddCategoryPage tree={tree} saveTree={saveTree} />}
        />
        <Route
          path="/node/*"
          element={<NodePage tree={tree} saveTree={saveTree} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
