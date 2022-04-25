import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { ImageI } from "../screens/AddProduct";
import { getId, uriToBlob } from "./utils";
export interface ProductsI {
  id: string;
  name: string;
  image: string;
  imageBlob: ImageI;
  price: string;
  offerprice: string;
}

interface ApiResponse {
  statusCode: number;
  message: string;
}

export function addProduct(product: ProductsI): Promise<ApiResponse> {
  return new Promise((resolve, reject) => {
    const db = getFirestore();
    const id = getId(12);
    uploadToStorage(product.imageBlob).then((imageUrl) => {
      console.log(imageUrl);
      setDoc(doc(db, "products", id), { ...product, image: imageUrl, id: id })
        .then(() => {
          resolve({ statusCode: 200, message: "Product Added" });
        })
        .catch((err) => {
          resolve({ statusCode: 400, message: err.code });
        });
    });
  });
}

const uploadToStorage = (imageUri: ImageI) => {
  return new Promise((resolve, reject) => {
    uriToBlob(imageUri.uri).then((blob: any) => {
      const storage = getStorage();
      const storageRef = ref(storage, "images" + imageUri.name);
      const uploadTask = uploadBytesResumable(storageRef, blob);
      uploadTask.on(
        "state_changed",
        () => {},
        () => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            resolve(url);
          });
        }
      );
    });
  });
};

export function deleteProduct(productId: string): Promise<ApiResponse> {
  return new Promise((resolve, reject) => {
    const db = getFirestore();
    deleteDoc(doc(db, "products", productId)).then((response) => {
      resolve({ statusCode: 200, message: "Product Deleted" });
    });
  });
}
