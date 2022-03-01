import { getApp, initializeApp } from "@firebase/app";
import { getStorage } from "@firebase/storage";
import { FirebaseOptions } from "@firebase/app-types";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyAiCvVK4OPJQ6ItR2-v0tOe2eyKs3o9lpM",
  authDomain: "next-fb-blog.firebaseapp.com",
  projectId: "next-fb-blog",
  storageBucket: "next-fb-blog.appspot.com",
  messagingSenderId: "4053232066",
  appId: "1:4053232066:web:4e7fecf06a31ad9dd10e5b",
};

function createFirebaseApp(config: FirebaseOptions) {
  try {
    return getApp();
  } catch {
    return initializeApp(config);
  }
}

const app = createFirebaseApp(firebaseConfig);

export const storage = getStorage(app);
