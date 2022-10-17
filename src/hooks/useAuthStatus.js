import React, { useState, useEffect } from 'react';
// Any time the state changes, if we go from logged-in to not logged-in, this method will fire-off
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function useAuthStatus() {
  const [loggedIn, setLoggedIn] = useState(false);
  // Same as Loading
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, user => {
      if (user) {
        setLoggedIn(true);
      }
      setCheckingStatus(false);
    });
  });

  return { loggedIn, checkingStatus };
}

export default useAuthStatus;
