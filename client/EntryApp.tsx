import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import App from './App';

export default function EntryApp() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Set ready to true immediately to show the app
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <>
        <StatusBar style="light" translucent backgroundColor="transparent" />
      </>
    );
  }

  return (
    <>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <App />
    </>
  );
} 