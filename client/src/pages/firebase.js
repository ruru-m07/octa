import { initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    authDomain: "octa-91dd7.firebaseapp.com",
    projectId: "octa-91dd7",
    storageBucket: "octa-91dd7.appspot.com",
    messagingSenderId: "752462577403",
    appId: "1:752462577403:web:6e343d655a5e41a9923a5e",
    measurementId: "G-Z9J5KKL3G6",
}

// Initialize Firebase and cloud storage
export const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
// export const storage = getStorage("http://127.0.0.1:4000/storage/octa-91dd7.appspot.com")


// import { initializeApp } from 'firebase/app';
// import { getStorage } from 'firebase/storage';

// const firebaseConfig = {
//   // Your Firebase config here
// };

// const app = initializeApp(firebaseConfig);

// // Use emulator only in development environment
// if (process.env.NODE_ENV === 'development') {
//   import('firebase/storage/emulator').then(() => {
//     const storage = getStorage(app);
//   });
// } else {
//   // For production or other environments
//   const storage = getStorage(app);
// }

// export { storage };
