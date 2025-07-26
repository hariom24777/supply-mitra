// src/firebase/productUtils.js
import { db } from "./config";
import { collection, addDoc } from "firebase/firestore";

export const addProduct = async (product) => {
  try {
    const docRef = await addDoc(collection(db, "products"), product);
    return docRef.id;
  } catch (e) {
    console.error("Error adding product: ", e);
    return null;
  }
};
