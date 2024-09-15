import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

function OnlyAdminPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    return <Navigate to="/sign-in" />;
  }

  return currentUser.isAdmin ? <Outlet /> : <Navigate to="/sign-in" />;
}

export default OnlyAdminPrivateRoute;