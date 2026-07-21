import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

export async function uploadImage(
  file: File | Buffer,
  path: string,
  contentType: string = "image/jpeg"
): Promise<string> {
  const storageRef = ref(storage, path);

  let body: ArrayBuffer | Buffer;
  if (file instanceof File) {
    body = await file.arrayBuffer();
  } else {
    body = file;
  }

  await uploadBytes(storageRef, body, { contentType });
  return getDownloadURL(storageRef);
}

export async function uploadBookingImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `booking-images/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
  return uploadImage(file, fileName, file.type);
}

export async function uploadGalleryImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `gallery/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
  return uploadImage(file, fileName, file.type);
}

export async function deleteImage(downloadUrl: string): Promise<void> {
  try {
    // Extract path from download URL
    const url = new URL(downloadUrl);
    const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
    if (pathMatch) {
      const filePath = decodeURIComponent(pathMatch[1]);
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);
    }
  } catch {
    // If deletion fails, just continue (file might already be gone)
  }
}
