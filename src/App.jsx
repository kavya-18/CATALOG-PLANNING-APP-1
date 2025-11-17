// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import AddCategoryPage from "./pages/AddCategoryPage";
import NodePage from "./pages/NodePage";

import { db } from "./firebase/firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

// Single root document for the whole tree
const ROOT_COLLECTION = "tree";
const ROOT_ID = "root";

export default function App() {
  const [tree, setTree] = useState(null);   // full tree { id, name, children[] }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Ensure root doc exists, then listen in realtime
  // --------------------------------------------------
  useEffect(() => {
    const rootRef = doc(db, ROOT_COLLECTION, ROOT_ID);
    let unsubscribe;

    async function init() {
      try {
        // 1) Check if root exists
        const snap = await getDoc(rootRef);

        if (!snap.exists()) {
          // Create a clean empty tree as default
          const initialTree = {
            id: ROOT_ID,
            name: "Wedding Categories",
            children: [], // all top-level categories
          };
          await setDoc(rootRef, initialTree);
        }

        // 2) Realtime subscription
        unsubscribe = onSnapshot(
          rootRef,
          (docSnap) => {
            const data = docSnap.data();
            if (data) {
              // Always make sure children is an array
              if (!Array.isArray(data.children)) {
                data.children = [];
              }
              setTree(data);
              setLoading(false);
            } else {
              setError("No data found in Firestore.");
              setLoading(false);
            }
          },
          (err) => {
            console.error("Firestore listener error:", err);
            setError("Error listening to updates.");
            setLoading(false);
          }
        );
      } catch (err) {
        console.error("🔥 Firestore init error:", err);
        setError("Error loading data from Firestore.");
        setLoading(false);
      }
    }

    init();

    // Cleanup listener on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // --------------------------------------------------
  // Helper: save updated tree back to Firestore
  //   - accepts either a full object OR an updater fn
  // --------------------------------------------------
  const saveTree = async (next) => {
    try {
      const rootRef = doc(db, ROOT_COLLECTION, ROOT_ID);

      // Allow both:
      // saveTree(newTreeObject)
      // saveTree(prev => newTreeObjectFromPrev)
      const updatedTree =
        typeof next === "function" ? next(tree) : next;

      // Always normalize children
      const finalTree = {
        ...updatedTree,
        id: ROOT_ID,
        name: updatedTree.name || "Wedding Categories",
        children: Array.isArray(updatedTree.children)
          ? updatedTree.children
          : [],
      };

      // Write to Firestore (listener will update local state)
      await setDoc(rootRef, finalTree);
    } catch (err) {
      console.error("🔥 saveTree Firestore error:", err);
      setError("Error saving changes.");
    }
  };

  // --------------------------------------------------
  // Basic loading / error UI
  // --------------------------------------------------
  if (loading || !tree) {
    return (
      <div className="page-container">
        <h2>Loading your wedding planner…</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <h2>Something went wrong.</h2>
        <p>{error}</p>
      </div>
    );
  }

  // --------------------------------------------------
  // Routes
  // --------------------------------------------------
  return (
    <BrowserRouter>
      <Routes>
        {/* Home: root categories */}
        <Route
          path="/"
          element={<HomePage tree={tree} saveTree={saveTree} />}
        />

        {/* Add new TOP-LEVEL category */}
        <Route
          path="/add-category"
          element={<AddCategoryPage tree={tree} saveTree={saveTree} />}
        />

        {/* Any nested node path: /node/sarees, /node/sarees/pattu, etc. */}
        <Route
          path="/node/*"
          element={<NodePage tree={tree} saveTree={saveTree} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
