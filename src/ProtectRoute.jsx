import { useCookies } from 'react-cookie';
import { Navigate, Outlet } from 'react-router-dom'
import { isTokenExpired } from './config';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from './redux/slices/userAuthSlice';
import { useEffect, useState } from 'react';

function ProtectRoute() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const [cookie, setCookie, removeCookie] = useCookies(['token']);
  useEffect(()=>{
    if (!user) {
      dispatch(fetchUser(cookie.token));
    }

  },[])
  if (isTokenExpired(cookie.token)) {
    // removeCookie('token');
    return <Navigate to='/login' />
  }
  if(user)
  return <Outlet />;
}

export default ProtectRoute
