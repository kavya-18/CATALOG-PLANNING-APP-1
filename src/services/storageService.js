// src/services/storageService.js
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebase"; // <- using the same app as Firestore

export async function uploadImages(files, folder = "nodes") {
  if (!files || files.length === 0) return [];

  const urls = [];

  for (const file of files) {
    const safeName = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `${folder}/${safeName}`);

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    urls.push(url);
  }

  return urls;
}
