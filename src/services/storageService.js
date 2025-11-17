// src/services/storageService.js
import { storage } from "../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Upload File[] to Firebase Storage and return an array of download URLs.
 * pathPrefix example: "root/saree" or "root/saree/blouse"
 */
export async function uploadImages(files, pathPrefix) {
  if (!files || files.length === 0) return [];

  const uploads = files.map(async (file, index) => {
    const safeName = file.name.replace(/\s+/g, "_");
    const storageRef = ref(
      storage,
      `${pathPrefix}/${Date.now()}_${index}_${safeName}`
    );

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  });

  return Promise.all(uploads);
}
