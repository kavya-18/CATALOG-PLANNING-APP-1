// src/services/firestoreService.js
import { db } from "../firebase/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  runTransaction,
} from "firebase/firestore";

const COLLECTION = "nodes";

/**
 * Ensure root node exists: nodes/root and return it.
 */
export async function createRootIfMissing() {
  const ref = doc(db, COLLECTION, "root");
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const data = {
      name: "Wedding",
      parentId: null,
      notes: "",
      status: "Idea",
      link: "",
      images: [],
      children: [],
    };
    await setDoc(ref, data);
    return { id: "root", ...data };
  }

  const existing = snap.data() || {};
  const patch = {};
  if (!("name" in existing)) patch.name = "Wedding";
  if (!("parentId" in existing)) patch.parentId = null;
  if (!("notes" in existing)) patch.notes = "";
  if (!("status" in existing)) patch.status = "Idea";
  if (!("link" in existing)) patch.link = "";
  if (!("images" in existing)) patch.images = [];
  if (!("children" in existing)) patch.children = [];

  if (Object.keys(patch).length > 0) {
    await updateDoc(ref, patch);
  }

  return { id: "root", ...existing, ...patch };
}

/** Get a node by id */
export async function getNode(id) {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/** Get ordered children for a parent */
export async function getChildren(parentId) {
  const parent = await getNode(parentId);
  if (!parent) return [];
  const childIds = parent.children || [];

  const result = [];
  for (const cid of childIds) {
    const child = await getNode(cid);
    if (child) result.push(child);
  }
  return result;
}

/** Create a new node under parentId */
export async function createNode({ parentId, name, link = "", images = [] }) {
  const parentRef = doc(db, COLLECTION, parentId);
  const newId =
    "node_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
  const childRef = doc(db, COLLECTION, newId);

  const childData = {
    name,
    parentId,
    notes: "",
    status: "Idea",
    link,
    images,
    children: [],
  };

  await runTransaction(db, async (tx) => {
    const parentSnap = await tx.get(parentRef);
    if (!parentSnap.exists()) {
      throw new Error("Parent node not found: " + parentId);
    }
    const parentData = parentSnap.data();
    const updatedChildren = [...(parentData.children || []), newId];

    tx.set(childRef, childData);
    tx.update(parentRef, { children: updatedChildren });
  });

  return { id: newId, ...childData };
}

/** Update node fields */
export async function updateNode(id, updates) {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, updates);
}

/** Reorder children array for a parent */
export async function reorderChildren(parentId, newChildIds) {
  const ref = doc(db, COLLECTION, parentId);
  await updateDoc(ref, { children: newChildIds });
}

/** Internal: recursively delete descendants */
async function deleteNodeRecursive(id) {
  const node = await getNode(id);
  if (!node) return;

  const children = node.children || [];
  for (const cid of children) {
    await deleteNodeRecursive(cid);
  }
  await deleteDoc(doc(db, COLLECTION, id));
}

/**
 * Delete a node and all its descendants,
 * and remove it from its parent's children list.
 */
export async function deleteNodeAndDescendants(id) {
  const node = await getNode(id);
  if (!node) return;

  const parentId = node.parentId;
  if (parentId) {
    const parentRef = doc(db, COLLECTION, parentId);
    await runTransaction(db, async (tx) => {
      const parentSnap = await tx.get(parentRef);
      if (!parentSnap.exists()) return;
      const data = parentSnap.data();
      const children = (data.children || []).filter((cid) => cid !== id);
      tx.update(parentRef, { children });
    });
  }

  await deleteNodeRecursive(id);
}
