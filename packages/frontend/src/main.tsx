import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import 'src/style/index.css';
import store from './redux/store.ts';
import router from './routes/router.tsx';

const firebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
});

// todo: enable offline persistence and listen for the metadata update
// https://firebase.google.com/docs/firestore/manage-data/enable-offline#web
export const firebaseDb = getFirestore(firebaseApp);

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);

  root.render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>,
  );
}
