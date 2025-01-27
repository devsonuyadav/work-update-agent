/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../../firebase/config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function Login() {
  const [error, setError] = useState<string>('');;
  const googleProvider = new GoogleAuthProvider();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);

  googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
  googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
  googleProvider.addScope('https://www.googleapis.com/auth/gmail.send');
  googleProvider.addScope('https://www.googleapis.com/auth/gmail.modify');
  googleProvider.addScope('https://www.googleapis.com/auth/gmail.labels');
  googleProvider.addScope('https://www.googleapis.com/auth/gmail.compose');
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider, {
        LoginHint: 'sky32752@gmail.com'
      });

      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const refreshToken = result.user.refreshToken;
      const idToken = await result.user.getIdToken();

      const user = result.user;

      if (user.email) {

  const data = {username: user.displayName,
    email: user.email,
    name: user.displayName,
    accessToken: token,
    refreshToken: refreshToken,
    lastLogin: serverTimestamp(),
    photoURL: user.photoURL,
    idToken: idToken,
    updatedAt: serverTimestamp(),}
    setUser(data);
        // Store user data in Firestore
        const userRef = doc(db, 'users', user.uid);
        await setDoc(
          userRef,
          {
            username: user.displayName,
            email: user.email,
            name: user.displayName,
            accessToken: token,
            refreshToken: refreshToken,
            lastLogin: serverTimestamp(),
            photoURL: user.photoURL,
            idToken: idToken,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
        setError('');

        // Successful login, redirect to dashboard or home
        // router.push('/dashboard');
      } else {
        setError('Email access is required for login');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 font-mono">
            Sign in to your account
          </h2>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/*show as json ojvect and can be copied */}
      <code className="text-sm text-gray-500 mt-4 max-w-screen-sm text-wrap overflow-x-auto ">{JSON.stringify(user)}</code>
    </div>
  );
}
