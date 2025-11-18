import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();

export async function uploadImages(files, folder = "images") {
  const urls = [];

  for (const file of files) {
    const storageRef = ref(storage, `${folder}/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    urls.push(url);
  }

  return urls;
}
