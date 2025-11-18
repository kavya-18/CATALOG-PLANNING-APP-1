// src/services/firestoreService.js

import { db } from "../firebase/firebase";
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection } from "firebase/firestore";

// ---------- ADD ROOT CATEGORY ----------
export async function addCategory(data) {
  await setDoc(doc(db, "categories", data.id), {
    ...data,
    parent: null,
    children: []
  });
}

// ---------- ADD SUBCATEGORY / NODE ----------
export async function addNode(parentId, data) {
  await setDoc(doc(db, "nodes", data.id), {
    ...data,
    parent: parentId,
    children: []
  });
}

// ---------- ADD ITEM ----------
export async function addItem(parentId, data) {
  await setDoc(doc(db, "items", data.id), {
    ...data,
    parent: parentId,
    children: []
  });
}

// ---------- UPDATE ANY NODE/ITEM ----------
export async function updateAny(collectionName, id, updates) {
  await updateDoc(doc(db, collectionName, id), updates);
}

// ---------- DELETE ----------
export async function deleteAny(collectionName, id) {
  await deleteDoc(doc(db, collectionName, id));
}

// ---------- READ ONE NODE ----------
export async function getAny(collectionName, id) {
  const snap = await getDoc(doc(db, collectionName, id));
  return snap.exists() ? snap.data() : null;
}
