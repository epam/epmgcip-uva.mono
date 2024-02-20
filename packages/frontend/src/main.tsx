import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import 'src/style/index.css';
import { RouterProvider } from 'react-router-dom';
import router from './routes/router.tsx';
import store from './redux/store.ts';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
});

export const firebaseDb = getFirestore(firebaseApp);

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);

  root.render(
    // <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    // </React.StrictMode>
  );
}
