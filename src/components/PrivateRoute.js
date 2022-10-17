import React from 'react';
// Not the hook, we use Navigate Component which is used to redirect, basically it is old Redirect component
// Outlet will allow us to render child routes or child elements
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStatus from '../hooks/useAuthStatus';
import Spinner from './Spinner';

function PrivateRoute() {
  const { loggedIn, checkingStatus } = useAuthStatus();

  if (checkingStatus) {
    return <Spinner />;
  }

  return <>{loggedIn ? <Outlet /> : <Navigate to='/sign-in' />}</>;
}

export default PrivateRoute;
